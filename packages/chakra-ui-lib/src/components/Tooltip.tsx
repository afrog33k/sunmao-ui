import { Type } from '@sinclair/typebox';
import { Tooltip } from '@chakra-ui/react';
import { implementRuntimeComponent, TextPropertySchema } from '@sunmao-ui/runtime';
import { getColorSchemePropertySchema } from './Types/ColorScheme';
import { BASIC, LAYOUT, BEHAVIOR, APPEARANCE } from './constants/category';

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  defaultIsOpen: Type.Boolean({
    title: 'Default Is Open',
    category: BASIC,
  }),
  placement: Type.KeyOf(
    Type.Object({
      top: Type.String(),
      right: Type.String(),
      bottom: Type.String(),
      left: Type.String(),
      auto: Type.String(),
      'auto-start': Type.String(),
      'auto-end': Type.String(),
      'top-start': Type.String(),
      'top-end': Type.String(),
      'bottom-start': Type.String(),
      'bottom-end': Type.String(),
      'right-start': Type.String(),
      'right-end': Type.String(),
      'left-start': Type.String(),
      'left-end': Type.String(),
    }),
    {
      title: 'Placement',
      category: LAYOUT,
    }
  ),
  shouldWrapChildren: Type.Boolean({
    title: 'Should Wrap Children',
    category: BEHAVIOR,
  }),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BEHAVIOR,
  }),
  isOpen: Type.Boolean({
    title: 'Open State',
    category: BEHAVIOR,
  }),
  hasArrow: Type.Boolean({
    title: 'Has Arrow',
    category: APPEARANCE,
  }),
  colorScheme: getColorSchemePropertySchema({
    title: 'Color Scheme',
    category: APPEARANCE,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'tooltip',
    description: 'chakra-ui tooltip',
    displayName: 'Tooltip',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {
      text: 'tooltip',
      defaultIsOpen: false,
      placement: 'top',
      shouldWrapChildren: false,
      isDisabled: false,
      isOpen: false,
      hasArrow: true,
      colorScheme: 'blue',
    },
    exampleSize: [2, 1],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    methods: {},
    slots: ['content'],
    styleSlots: [],
    events: [],
  },
})(
  ({
    text,
    shouldWrapChildren,
    placement = 'auto',
    isOpen,
    hasArrow,
    isDisabled,
    defaultIsOpen,
    slotsElements,
    elementRef,
  }) => {
    return (
      /* 
          Chakra tooltip requires children to be created by forwardRef.
          If not, should add shouldWrapChildren.
      */
      <Tooltip
        label={text}
        placement={placement}
        isOpen={isOpen}
        hasArrow={hasArrow}
        isDisabled={isDisabled}
        defaultIsOpen={defaultIsOpen}
        shouldWrapChildren={shouldWrapChildren}
        ref={elementRef}
      >
        {slotsElements.content}
      </Tooltip>
    );
  }
);
