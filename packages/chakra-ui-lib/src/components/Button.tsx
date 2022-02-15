import { useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { Button as BaseButton } from '@chakra-ui/react';
import { Text, TextPropertySchema, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { getColorSchemePropertySchema } from './Types/ColorScheme';
import { BEHAVIOR, APPEARANCE } from './constants/category';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  isLoading: Type.Boolean({
    title: 'Loading',
    description: 'Whether the button is in a loading state',
    category: BEHAVIOR,
  }),
  colorScheme: getColorSchemePropertySchema({
    title: 'Color Scheme',
    category: APPEARANCE,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'button',
    displayName: 'Button',
    description: 'chakra-ui button',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      text: {
        raw: 'text',
        format: 'plain',
      },
      isLoading: false,
      colorScheme: 'blue',
    },
    exampleSize: [2, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {
      click: undefined,
    },
    slots: [],
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(
  ({
    text,
    mergeState,
    subscribeMethods,
    callbackMap: callbacks,
    colorScheme,
    isLoading,
    customStyle,
    getElement,
  }) => {
    useEffect(() => {
      mergeState({ value: text.raw });
    }, [mergeState, text.raw]);

    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      subscribeMethods({
        click() {
          ref.current?.click();
        },
      });
    }, [subscribeMethods]);

    useEffect(() => {
      if (getElement && ref.current) {
        getElement(ref.current);
      }
    }, [getElement]);

    return (
      <BaseButton
        className={css`
          ${customStyle?.content}
        `}
        {...{ colorScheme, isLoading }}
        ref={ref}
        onClick={callbacks?.onClick}
      >
        <Text value={text} />
      </BaseButton>
    );
  }
);
