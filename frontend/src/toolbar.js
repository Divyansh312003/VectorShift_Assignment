// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeDefinitions, toolbarNodes } from './nodes/nodeDefinitions';

export const PipelineToolbar = () => {

    return (
        <header className="pipeline-toolbar">
            <div className="pipeline-toolbar__title">
                <span>VectorShift Pipeline Builder</span>
            </div>
            <div className="pipeline-toolbar__nodes">
                {toolbarNodes.map(({ type, label }) => {
                    const definition = nodeDefinitions[type];

                    return (
                        <DraggableNode
                            key={type}
                            type={type}
                            label={label}
                            icon={definition.icon}
                            subtitle={definition.subtitle}
                            tone={definition.tone}
                        />
                    );
                })}
            </div>
        </header>
    );
};
