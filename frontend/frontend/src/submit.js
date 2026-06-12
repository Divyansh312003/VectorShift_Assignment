import { useState } from 'react';
import { useStore } from './store';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes.map(({ id, type, data }) => ({ id, type, data })),
                    edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
                        id,
                        source,
                        target,
                        sourceHandle,
                        targetHandle,
                    })),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Unable to parse the pipeline.');
            }

            const result = await response.json();

            if (
                typeof result.num_nodes !== 'number' ||
                typeof result.num_edges !== 'number' ||
                typeof result.is_dag !== 'boolean'
            ) {
                throw new Error('The backend returned an unexpected response.');
            }

            const graphStatus = result.is_dag
                ? 'This pipeline is a directed acyclic graph.'
                : 'This pipeline contains a cycle.';

            alert(
                `Pipeline summary\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nGraph: ${graphStatus}`
            );
        } catch (error) {
            alert(`Pipeline submit failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="pipeline-submit">
            <button
                className="pipeline-submit__button"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Pipeline'}
            </button>
        </footer>
    );
}
