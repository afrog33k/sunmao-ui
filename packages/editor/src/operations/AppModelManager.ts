import { Application, ComponentTrait, ApplicationComponent } from '@sunmao-ui/core';
import { parseType } from '@sunmao-ui/runtime';
import {
  Operations,
  CreateComponentOperation,
  RemoveComponentOperation,
  ModifyComponentPropertyOperation,
  ModifyTraitPropertyOperation,
  ModifyComponentIdOperation,
  SortComponentOperation,
  AddTraitOperation,
  RemoveTraitOperation,
  ModifyTraitPropertiesOperation,
  ReplaceComponentPropertyOperation,
  ReplaceAppOperation,
} from './Operations';
import { produce } from 'immer';
import { eventBus } from '../eventBus';
import { set, isEqual } from 'lodash-es';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';

function genSlotTrait(parentId: string, slot: string): ComponentTrait {
  return {
    type: 'core/v1/slot',
    properties: {
      container: {
        id: parentId,
        slot: slot,
      },
    },
  };
}

function genComponent(
  registry: Registry,
  type: string,
  id: string,
  parentId?: string,
  slot?: string
): ApplicationComponent {
  const { version, name } = parseType(type);
  const cImpl = registry.getComponent(version, name);
  const traits = parentId && slot ? [genSlotTrait(parentId, slot)] : [];
  const initProperties = cImpl.metadata.exampleProperties;
  return {
    id,
    type: type,
    properties: initProperties,
    traits: traits,
  };
}

export class AppModelManager {
  private undoStack: Operations[] = [];
  private app: Application;
  private registry: Registry;

  constructor(app: Application, registry: Registry) {
    const appFromLS = localStorage.getItem('schema');
    if (appFromLS) {
      this.app = JSON.parse(appFromLS);
    } else {
      this.app = app;
    }
    this.registry = registry;

    eventBus.on('undo', () => this.undo());
    eventBus.on('operation', o => this.apply(o));

    this.updateApp(this.app);
  }

  getApp() {
    return this.app;
  }

  genId(componentType: string) {
    const { name } = parseType(componentType);
    const componentsCount = this.app.spec.components.filter(
      c => c.type === componentType
    ).length;
    return `${name}${componentsCount + 1}`;
  }

  updateApp(app: Application) {
    eventBus.send('appChange', app);
    localStorage.setItem('schema', JSON.stringify(app));
    this.app = app;
  }

  undo() {
    if (this.undoStack.length === 0) {
      return this.app;
    }
    const o = this.undoStack.pop()!;
    this.apply(o, true);
  }

  apply(o: Operations, noEffect = false) {
    let newApp = this.app;
    switch (o.kind) {
      case 'createComponent':
        const createO = o as CreateComponentOperation;
        const newComponent = genComponent(
          this.registry,
          createO.componentType,
          createO.componentId || this.genId(createO.componentType),
          createO.parentId,
          createO.slot
        );
        if (!noEffect) {
          const undoOperation = new RemoveComponentOperation(newComponent.id);
          this.undoStack.push(undoOperation);
        }
        newApp = produce(this.app, draft => {
          draft.spec.components.push(newComponent);
        });
        break;
      case 'removeComponent':
        const removeO = o as RemoveComponentOperation;
        newApp = produce(this.app, draft => {
          const i = draft.spec.components.findIndex(c => c.id === removeO.componentId);
          draft.spec.components.splice(i, 1);
        });
        break;
      case 'modifyComponentProperty':
        const mo = o as ModifyComponentPropertyOperation;
        newApp = produce(this.app, draft => {
          return draft.spec.components.forEach(c => {
            if (c.id === mo.componentId) {
              set(c.properties, mo.propertyKey, mo.propertyValue);
            }
          });
        });
        if (!noEffect) {
          const oldValue = this.app.spec.components.find(c => c.id === mo.componentId)
            ?.properties[mo.propertyKey];
          const undoOperation = new ModifyComponentPropertyOperation(
            mo.componentId,
            mo.propertyKey,
            oldValue
          );
          this.undoStack.push(undoOperation);
        }
        break;
      case 'replaceComponentProperty':
        const ro = o as ReplaceComponentPropertyOperation;
        newApp = produce(this.app, draft => {
          return draft.spec.components.forEach(c => {
            if (c.id === ro.componentId) {
              c.properties = ro.properties;
            }
          });
        });
        if (!noEffect) {
          const oldValue = this.app.spec.components.find(
            c => c.id === ro.componentId
          )?.properties;
          const undoOperation = new ReplaceComponentPropertyOperation(
            ro.componentId,
            oldValue
          );
          this.undoStack.push(undoOperation);
        }
        break;
      case 'modifyComponentId':
        const mIdo = o as ModifyComponentIdOperation;
        newApp = produce(this.app, draft => {
          return draft.spec.components.forEach(c => {
            if (c.id === mIdo.componentId) {
              c.id = mIdo.value;
            }
          });
        });
        if (!noEffect) {
          const undoOperation = new ModifyComponentIdOperation(
            mIdo.value,
            mIdo.componentId
          );
          this.undoStack.push(undoOperation);
        }
        break;
      case 'modifyTraitProperty':
        const mto = o as ModifyTraitPropertyOperation;
        let oldValue;
        newApp = produce(this.app, draft => {
          draft.spec.components.forEach(c => {
            if (c.id === mto.componentId) {
              c.traits.forEach(t => {
                if (t.type === mto.traitType) {
                  oldValue = t.properties[mto.propertyKey];
                  set(t.properties, mto.propertyKey, mto.propertyValue);
                }
              });
            }
          });
        });
        if (!noEffect) {
          const undoOperation = new ModifyTraitPropertyOperation(
            mto.componentId,
            mto.traitType,
            mto.propertyKey,
            oldValue
          );
          this.undoStack.push(undoOperation);
        }
        break;
      case 'modifyTraitProperties':
        const mtpo = o as ModifyTraitPropertiesOperation;
        let oldProperties;
        newApp = produce(this.app, draft => {
          draft.spec.components.forEach(c => {
            if (c.id === mtpo.componentId) {
              c.traits.forEach(t => {
                if (t.type === mtpo.traitType) {
                  oldProperties = t.properties;
                  t.properties = mtpo.properties;
                }
              });
            }
          });
        });
        if (!noEffect) {
          const undoOperation = new ModifyTraitPropertiesOperation(
            mtpo.componentId,
            mtpo.traitType,
            oldProperties || {}
          );
          this.undoStack.push(undoOperation);
        }
        break;
      case 'addTraitOperation':
        const ato = o as AddTraitOperation;
        let i = 0;
        newApp = produce(this.app, draft => {
          draft.spec.components.forEach(c => {
            if (c.id === ato.componentId) {
              c.traits.push({
                type: ato.traitType,
                properties: ato.properties,
              });
              i = c.traits.length - 1;
            }
          });
        });
        if (!noEffect) {
          const removeTraitOperation = new RemoveTraitOperation(ato.componentId, i);
          this.undoStack.push(removeTraitOperation);
        }
        break;
      case 'removeTraitOperation':
        const rto = o as RemoveTraitOperation;
        newApp = produce(this.app, draft => {
          draft.spec.components.forEach(c => {
            if (c.id === rto.componentId) {
              c.traits.splice(rto.traitIndex, 1);
            }
          });
        });
        break;
      case 'sortComponent':
        const sortO = o as SortComponentOperation;
        newApp = produce(this.app, draft => {
          const iIndex = draft.spec.components.findIndex(c => c.id === sortO.componentId);
          const iComponent = this.app.spec.components[iIndex];
          const iSlotTrait = iComponent.traits.find(t => t.type === 'core/v1/slot');
          if (!iSlotTrait) return;

          const findArray =
            sortO.direction === 'up'
              ? this.app.spec.components.slice(0, iIndex).reverse()
              : this.app.spec.components.slice(iIndex + 1);

          const jComponent = findArray.find(c => {
            const jSlotTrait = c.traits.find(t => t.type === 'core/v1/slot');
            if (jSlotTrait) {
              return isEqual(jSlotTrait, iSlotTrait);
            }
          });
          if (!jComponent) return;

          const jIndex = this.app.spec.components.findIndex(c => c.id === jComponent.id);
          if (jIndex > -1) {
            [draft.spec.components[iIndex], draft.spec.components[jIndex]] = [
              draft.spec.components[jIndex],
              draft.spec.components[iIndex],
            ];
          }
        });
        break;
      case 'replaceApp': {
        const rao = o as ReplaceAppOperation;
        newApp = produce(this.app, () => {
          return rao.app;
        });
        break;
      }
    }
    this.updateApp(newApp);
  }
}
