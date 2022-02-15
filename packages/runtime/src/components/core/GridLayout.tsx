import React, { Suspense } from 'react';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { partial } from 'lodash-es';
import { css } from '@emotion/css';

const BaseGridLayout = React.lazy(() => import('../_internal/GridLayout'));

const PropsSchema = Type.Object({
  layout: Type.Array(
    Type.Object({
      x: Type.Number({
        title: 'X',
      }),
      y: Type.Number({
        title: 'Y',
      }),
      w: Type.Number({
        title: 'Width',
      }),
      h: Type.Number({
        title: 'Height',
      }),
      i: Type.String(),
      isResizable: Type.Boolean({
        title: 'Resizable',
      }),
    }),
    {
      title: 'Layout',
      category: 'Layout',
    }
  ),
});

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'grid_layout',
    displayName: 'Grid Layout',
    description: 'drag and drop to layout in a grid',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      layout: [],
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSchema,
    state: {},
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
})(({ layout = [], gridCallbacks, component, customStyle, slotsElements }) => {
  const onDragStop = gridCallbacks?.onDragStop
    ? partial(gridCallbacks.onDragStop, component.id)
    : undefined;
  const onDrop = gridCallbacks?.onDrop
    ? partial(gridCallbacks.onDrop, component.id)
    : undefined;

  return (
    <Suspense fallback={null}>
      <BaseGridLayout
        isDraggable={!!gridCallbacks}
        isResizable={!!gridCallbacks}
        onDragStop={onDragStop}
        onDrop={onDrop}
        layout={layout}
        className={css`
          ${customStyle?.content}
        `}
      >
        {slotsElements.content}
      </BaseGridLayout>
    </Suspense>
  );
});
