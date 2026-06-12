import { memo, useEffect, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

const clamp = (min, value, max) => Math.min(Math.max(value, min), max);

const valueForField = (field, id, data) => {
  const currentValue = data?.[field.name];

  if (currentValue !== undefined) {
    return currentValue;
  }

  if (typeof field.defaultValue === 'function') {
    return field.defaultValue(id);
  }

  return field.defaultValue ?? '';
};

const reservedJsWords = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

const isValidTemplateVariable = (name) =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !reservedJsWords.has(name);

export const extractTemplateVariables = (text = '') => {
  const matches = text.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g);
  const variables = Array.from(matches, (match) => match[1].trim()).filter(
    isValidTemplateVariable
  );

  return Array.from(new Set(variables));
};

const renderField = ({ field, id, data, updateNodeField }) => {
  const value = valueForField(field, id, data);
  const controlStyle = field.getControlStyle?.(value);

  const handleChange = (event) => {
    updateNodeField(id, field.name, event.target.value);
  };

  if (field.type === 'select') {
    return (
      <label className="vs-field" key={field.name}>
        <span>{field.label}</span>
        <select className="nodrag" value={value} onChange={handleChange}>
          {field.options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="vs-field" key={field.name}>
        <span>{field.label}</span>
        <textarea
          className="nodrag"
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          style={controlStyle}
        />
      </label>
    );
  }

  return (
    <label className="vs-field" key={field.name}>
      <span>{field.label}</span>
      <input
        className="nodrag"
        type={field.type ?? 'text'}
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder}
        style={controlStyle}
      />
    </label>
  );
};

const handlePosition = (handles, index) => {
  const configuredTop = handles[index]?.top;

  if (configuredTop !== undefined) {
    return configuredTop;
  }

  return ((index + 1) / (handles.length + 1)) * 100;
};

const renderHandles = ({ handles, id, type, position }) =>
  handles.map((handle, index) => {
    const top = handlePosition(handles, index);
    const isLeft = position === Position.Left;

    return (
      <div key={handle.id}>
        <Handle
          className="vs-handle"
          type={type}
          position={position}
          id={`${id}-${handle.id}`}
          style={{ top: `${top}%` }}
        />
        {handle.label && (
          <span
            className={`vs-handle-label ${
              isLeft ? 'vs-handle-label--left' : 'vs-handle-label--right'
            }`}
            style={{ top: `calc(${top}% - 9px)` }}
          >
            {handle.label}
          </span>
        )}
      </div>
    );
  });

const BaseNode = ({ id, data, definition }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  const variableFieldDefinition =
    definition.fields?.find((field) => field.name === definition.variableField) ?? {
      name: definition.variableField,
    };

  const variableText = definition.variableField
    ? valueForField(variableFieldDefinition, id, data)
    : '';

  const variables = useMemo(() => extractTemplateVariables(variableText), [variableText]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals, variables]);

  const dynamicInputs = variables.map((variable) => ({
    id: variable,
    label: variable,
  }));

  const inputHandles = [...(definition.inputs ?? []), ...dynamicInputs];
  const outputHandles = definition.outputs ?? [];

  const dynamicStyle = definition.getSize?.({
    id,
    data,
    value: variableText,
    variables,
    clamp,
  });

  return (
    <div
      className={`vs-node vs-node--${definition.tone ?? 'default'}`}
      style={{ '--node-accent': definition.accent ?? '#2f80ed', ...dynamicStyle }}
    >
      {renderHandles({
        handles: inputHandles,
        id,
        type: 'target',
        position: Position.Left,
      })}

      {renderHandles({
        handles: outputHandles,
        id,
        type: 'source',
        position: Position.Right,
      })}

      <div className="vs-node__header">
        <div className="vs-node__badge">{definition.icon}</div>
        <div>
          <div className="vs-node__title">{definition.title}</div>
          {definition.subtitle && (
            <div className="vs-node__subtitle">{definition.subtitle}</div>
          )}
        </div>
      </div>

      {definition.description && (
        <p className="vs-node__description">{definition.description}</p>
      )}

      {definition.fields?.length > 0 && (
        <div className="vs-node__body">
          {definition.fields.map((field) =>
            renderField({ field, id, data, updateNodeField })
          )}
        </div>
      )}
    </div>
  );
};

export const createNodeComponent = (definition) =>
  memo((props) => <BaseNode {...props} definition={definition} />);
