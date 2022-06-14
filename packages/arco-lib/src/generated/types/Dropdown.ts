import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const DropdownPropsSpec = {
  dropdownType: StringUnion(['default', 'button'], {
    title: 'Type',
    category: Category.Basic,
  }),
  text: Type.String({
    title: 'Text',
    category: Category.Basic,
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title: 'Position',
    category: Category.Layout,
  }),
  trigger: StringUnion(['hover', 'click'], {
    title: 'Trigger',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  defaultPopupVisible: Type.Boolean({
    title: 'Default Visible',
    category: Category.Basic,
  }),
  autoAlignPopupWidth: Type.Boolean({
    title: 'Auto Align Popup Width',
    category: Category.Basic,
  }),
  unmountOnExit: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
  list: Type.Array(
    Type.Object({
      key: Type.String({
        title: 'Key',
      }),
      label: Type.String({
        title: 'Label',
      }),
    }),
    {
      title: 'List',
      category: Category.Basic,
      widget: 'core/v1/expression',
      weight: 10,
    }
  ),
};
