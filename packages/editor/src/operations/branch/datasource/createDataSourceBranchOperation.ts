import { AppModel } from '../../../AppModel/AppModel';
import { BaseBranchOperation } from '../../type';
import { CreateComponentBranchOperation } from '../index';
import { CreateTraitLeafOperation } from '../../leaf';
import { DataSourceType } from '../../../components/DataSource/DataSource';
import { TSchema } from '@sinclair/typebox';
import { parseTypeBox } from '@sunmao-ui/runtime';

export type CreateDataSourceBranchOperationContext = {
  id: string;
  type: DataSourceType;
};

export class CreateDataSourceBranchOperation extends BaseBranchOperation<CreateDataSourceBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const { id, type } = this.context;
    const traitType = type === DataSourceType.API ? 'core/v1/fetch' : 'core/v1/state';
    const traitSpec = this.registry.getTraitByType(traitType).spec;
    const initProperties = parseTypeBox(traitSpec.properties as TSchema);

    this.operationStack.insert(
      new CreateComponentBranchOperation(this.registry, {
        componentType: 'core/v1/dummy',
        componentId: id,
      })
    );
    this.operationStack.insert(
      new CreateTraitLeafOperation(this.registry, {
        componentId: id,
        traitType: traitType,
        properties:
          type === DataSourceType.API
            ? {
                ...initProperties,
                method: 'get',
              }
            : initProperties,
      })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
