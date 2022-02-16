import { useMemo } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import produce from 'immer';
import { ComponentSchema } from '@sunmao-ui/core';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { EventHandlerForm } from './EventHandlerForm';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';

type EventHandler = Static<typeof EventHandlerSchema>;

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

export const EventTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const handlers: EventHandler[] = useMemo(() => {
    return component.traits.find(t => t.type === 'core/v1/event')?.properties
      .handlers as Array<Static<typeof EventHandlerSchema>>;
  }, [component]);

  const eventTypes = useMemo(() => {
    return registry.getComponentByType(component.type).spec.events;
  }, [component.type, registry]);

  if (!eventTypes.length) return null;
  const onClickAddHandler = () => {
    const newHandler: EventHandler = {
      type: eventTypes[0],
      componentId: '',
      method: {
        name: '',
        parameters: {}
      },
      disabled: false,
      wait: {
        type: 'delay',
        time: 0
      }
    };

    if (!handlers) {
      eventBus.send(
        'operation',
        genOperation(registry, 'createTrait', {
          componentId: component.id,
          traitType: 'core/v1/event',
          properties: { handlers: [newHandler] }
        })
      );
    } else {
      // assume that we only have one event trait
      const index = component.traits.findIndex(t => t.type === 'core/v1/event');
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: component.id,
          traitIndex: index,
          properties: { handlers: [...handlers, newHandler] }
        })
      );
    }
  };

  const handlerForms = () =>
    (handlers || []).map((h, i) => {
      const onChange = (handler: EventHandler) => {
        const index = component.traits.findIndex(t => t.type === 'core/v1/event');
        const newHandlers = produce(handlers!, draft => {
          draft[i] = handler;
        });
        eventBus.send(
          'operation',
          genOperation(registry, 'modifyTraitProperty', {
            componentId: component.id,
            traitIndex: index,
            properties: {
              handlers: newHandlers
            }
          })
        );
      };

      const onRemove = () => {
        const index = component.traits.findIndex(t => t.type === 'core/v1/event');
        const newHandlers = produce(handlers!, draft => {
          draft.splice(i, 1);
        });
        eventBus.send(
          'operation',
          genOperation(registry, 'modifyTraitProperty', {
            componentId: component.id,
            traitIndex: index,
            properties: {
              handlers: newHandlers
            }
          })
        );
      };
      return (
        <EventHandlerForm
          eventTypes={eventTypes}
          handler={h}
          key={i}
          onChange={onChange}
          onRemove={onRemove}
          services={services}
        />
      );
    });

  return (
    <VStack width="full">
      <HStack
        justify="space-between"
        width="full"
      >
        <strong>Events</strong>
        <IconButton
          aria-label="add event"
          colorScheme="blue"
          icon={<AddIcon />}
          onClick={onClickAddHandler}
          size="sm"
          variant="ghost"
        />
      </HStack>
      <VStack width="full">{handlerForms()}</VStack>
    </VStack>
  );
};
