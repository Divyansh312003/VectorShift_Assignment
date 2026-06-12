import { createNodeComponent } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

export const TransformNode = createNodeComponent(nodeDefinitions.transform);
export const FilterNode = createNodeComponent(nodeDefinitions.filter);
export const ApiNode = createNodeComponent(nodeDefinitions.api);
export const DatabaseNode = createNodeComponent(nodeDefinitions.database);
export const ConditionNode = createNodeComponent(nodeDefinitions.condition);
