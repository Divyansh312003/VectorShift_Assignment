from collections import deque
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineNode(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class PipelineEdge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelinePayload(BaseModel):
    nodes: List[PipelineNode] = Field(default_factory=list)
    edges: List[PipelineEdge] = Field(default_factory=list)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_directed_acyclic_graph(nodes: List[PipelineNode], edges: List[PipelineEdge]) -> bool:
    node_ids = {node.id for node in nodes}

    if len(node_ids) != len(nodes):
        return False

    adjacency = {node_id: [] for node_id in node_ids}
    indegrees = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            return False

        adjacency[edge.source].append(edge.target)
        indegrees[edge.target] += 1

    queue = deque(node_id for node_id, indegree in indegrees.items() if indegree == 0)
    visited_count = 0

    while queue:
        node_id = queue.popleft()
        visited_count += 1

        for neighbor in adjacency[node_id]:
            indegrees[neighbor] -= 1
            if indegrees[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelinePayload):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_directed_acyclic_graph(pipeline.nodes, pipeline.edges),
    }
