import { Application } from '@sunmao-ui/core';

export const SingleComponentSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'single',
        type: 'test/v1/tester',
        properties: {
          text: 'Hello, world!',
        },
        traits: [],
      },
    ],
  },
};

// for testing whether a component and its siblings will unmount after schema changes
export const ComponentSchemaChangeSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'staticComponent',
        type: 'test/v1/tester',
        properties: {
          text: 'foo',
        },
        traits: [],
      },
      {
        id: 'dynamicComponent',
        type: 'test/v1/tester',
        properties: {
          text: 'bar',
        },
        traits: [],
      },
    ],
  },
};

export const HiddenTraitSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'input1',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [
          {
            type: 'core/v1/hidden',
            properties: {
              hidden: true,
            },
          },
        ],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{input1.value}}',
        },
        traits: [],
      },
    ],
  },
};

export const MergeStateSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{input.value}}-{{input2.value}}-{{input3.value}}',
        },
        traits: [],
      },
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [],
      },
      {
        id: 'input2',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'bar',
        },
        traits: [],
      },
      {
        id: 'input3',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'baz',
        },
        traits: [],
      },
    ],
  },
};

export const AsyncMergeStateSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'input',
        type: 'test/v1/input',
        properties: {
          defaultValue: 'foo',
        },
        traits: [],
      },
      {
        id: 'text',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'test/v1/timeout',
            properties: {
              value: '{{input.value + Math.random()}}',
            },
          },
        ],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{text.result}}',
        },
        traits: [],
      },
    ],
  },
};
