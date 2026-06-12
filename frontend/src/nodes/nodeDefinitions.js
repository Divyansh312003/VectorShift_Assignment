const nameFromId = (id, prefix, fallback) => id.replace(prefix, fallback);

const textNodeSize = ({ value = '', variables, clamp }) => {
  const lines = value.split('\n');
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const visualRows = lines.reduce(
    (total, line) => total + Math.max(1, Math.ceil(line.length / 36)),
    0
  );

  return {
    width: clamp(260, longestLine * 7 + 120, 560),
    minHeight: clamp(170, 132 + visualRows * 24 + variables.length * 8, 460),
  };
};

const textAreaSize = (value = '') => {
  const lines = value.split('\n');
  const visualRows = lines.reduce(
    (total, line) => total + Math.max(1, Math.ceil(line.length / 44)),
    0
  );

  return {
    height: `${Math.min(Math.max(96, visualRows * 24 + 28), 320)}px`,
  };
};

export const nodeDefinitions = {
  customInput: {
    type: 'customInput',
    title: 'Input',
    subtitle: 'Pipeline source',
    icon: 'IN',
    tone: 'source',
    accent: '#00a676',
    outputs: [{ id: 'value', label: 'value' }],
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        defaultValue: (id) => nameFromId(id, 'customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { label: 'Text', value: 'Text' },
          { label: 'File', value: 'File' },
        ],
      },
    ],
  },
  llm: {
    type: 'llm',
    title: 'LLM',
    subtitle: 'Generate response',
    icon: 'AI',
    tone: 'model',
    accent: '#7856ff',
    inputs: [
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ],
    outputs: [{ id: 'response', label: 'response' }],
  },
  customOutput: {
    type: 'customOutput',
    title: 'Output',
    subtitle: 'Pipeline result',
    icon: 'OUT',
    tone: 'sink',
    accent: '#f25c54',
    inputs: [{ id: 'value', label: 'value' }],
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        defaultValue: (id) => nameFromId(id, 'customOutput-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { label: 'Text', value: 'Text' },
          { label: 'Image', value: 'Image' },
        ],
      },
    ],
  },
  text: {
    type: 'text',
    title: 'Text',
    subtitle: 'Template builder',
    icon: 'TXT',
    tone: 'text',
    accent: '#f4a62a',
    variableField: 'text',
    getSize: textNodeSize,
    outputs: [{ id: 'output', label: 'text' }],
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        rows: 4,
        defaultValue: '{{input}}',
        placeholder: 'Hello {{input}}',
        getControlStyle: textAreaSize,
      },
    ],
  },
  transform: {
    type: 'transform',
    title: 'Transform',
    subtitle: 'Format data',
    icon: 'FX',
    tone: 'utility',
    accent: '#2f80ed',
    inputs: [{ id: 'input', label: 'input' }],
    outputs: [{ id: 'output', label: 'output' }],
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Summarize',
        options: [
          { label: 'Summarize', value: 'Summarize' },
          { label: 'Normalize', value: 'Normalize' },
          { label: 'Extract JSON', value: 'Extract JSON' },
        ],
      },
    ],
  },
  filter: {
    type: 'filter',
    title: 'Filter',
    subtitle: 'Route records',
    icon: 'IF',
    tone: 'logic',
    accent: '#c75cba',
    inputs: [
      { id: 'dataset', label: 'data' },
      { id: 'condition', label: 'rule' },
    ],
    outputs: [
      { id: 'matches', label: 'yes' },
      { id: 'rejected', label: 'no' },
    ],
    fields: [
      {
        name: 'rule',
        label: 'Rule',
        defaultValue: 'score > 0.8',
      },
    ],
  },
  api: {
    type: 'api',
    title: 'API',
    subtitle: 'Call service',
    icon: 'API',
    tone: 'service',
    accent: '#00a2c7',
    inputs: [{ id: 'payload', label: 'body' }],
    outputs: [{ id: 'response', label: 'response' }],
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'POST',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
      {
        name: 'endpoint',
        label: 'Endpoint',
        defaultValue: '/v1/enrich',
      },
    ],
  },
  database: {
    type: 'database',
    title: 'Database',
    subtitle: 'Fetch rows',
    icon: 'DB',
    tone: 'data',
    accent: '#5f8b4c',
    inputs: [{ id: 'query', label: 'query' }],
    outputs: [{ id: 'rows', label: 'rows' }],
    fields: [
      {
        name: 'source',
        label: 'Source',
        defaultValue: 'warehouse.users',
      },
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'Read',
        options: [
          { label: 'Read', value: 'Read' },
          { label: 'Write', value: 'Write' },
        ],
      },
    ],
  },
  condition: {
    type: 'condition',
    title: 'Condition',
    subtitle: 'Branch flow',
    icon: 'BR',
    tone: 'logic',
    accent: '#c75cba',
    inputs: [{ id: 'value', label: 'value' }],
    outputs: [
      { id: 'true', label: 'true' },
      { id: 'false', label: 'false' },
    ],
    fields: [
      {
        name: 'condition',
        label: 'When',
        defaultValue: 'status === "ready"',
      },
    ],
  },
};

export const toolbarNodes = [
  { type: 'customInput', label: 'Input' },
  { type: 'text', label: 'Text' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'transform', label: 'Transform' },
  { type: 'filter', label: 'Filter' },
  { type: 'api', label: 'API' },
  { type: 'database', label: 'Database' },
  { type: 'condition', label: 'Condition' },
];

export const getDefaultNodeData = (id, type) => {
  const definition = nodeDefinitions[type];
  const fieldDefaults =
    definition?.fields?.reduce((defaults, field) => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] =
          typeof field.defaultValue === 'function'
            ? field.defaultValue(id)
            : field.defaultValue;
      }

      return defaults;
    }, {}) ?? {};

  return {
    id,
    nodeType: type,
    ...fieldDefaults,
  };
};
