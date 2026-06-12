# VectorShift Frontend Assessment Workflow

## Overview

This project is a pipeline builder built with React, React Flow, Zustand, and a FastAPI backend. Users can drag nodes onto a canvas, connect them with edges, edit node fields, use dynamic variables in Text nodes, and submit the current pipeline to the backend for graph analysis.

The backend returns:

{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": true
}

The frontend shows these values in a user-friendly alert.

## How To Run

Backend:

cd backend
uvicorn main:app --reload

Frontend:

cd frontend
npm install
npm start

The frontend runs on http://localhost:3000 and sends submissions to http://localhost:8000/pipelines/parse.

## Application Workflow

1. User opens the React app.
2. Toolbar displays all available node types.
3. User drags nodes onto the React Flow canvas.
4. The app creates nodes from reusable node definitions.
5. User connects handles to create pipeline edges.
6. User edits fields inside nodes.
7. Text nodes resize as text grows.
8. Variables like {{ input }} create matching left-side handles.
9. User clicks Submit Pipeline.
10. Frontend sends nodes and edges to the backend.
11. Backend counts nodes, counts edges, checks DAG status, and returns the result.
12. Frontend displays the result in an alert.

## Frontend File Guide

### src/App.js

Top-level React component. It renders:

- PipelineToolbar
- PipelineUI
- SubmitButton

### src/index.js

React entry point. It mounts the app into the DOM.

### src/index.css

Contains all styling for the app:

- toolbar
- draggable node buttons
- canvas
- node cards
- handles
- input fields
- submit button
- responsive layout

### src/store.js

Defines the Zustand store.

It stores:

- nodes
- edges
- generated node IDs

It provides actions for:

- adding nodes
- updating nodes
- updating edges
- connecting nodes
- updating node field values

### src/toolbar.js

Renders the top toolbar using nodeDefinitions and toolbarNodes.

### src/draggableNode.js

Defines each draggable toolbar item. It stores the node type in the drag event.

### src/ui.js

Main React Flow canvas.

It handles:

- rendering nodes and edges
- dropping new nodes
- calculating node position
- creating node data
- registering node types
- connecting nodes
- showing canvas controls and minimap

### src/submit.js

Handles backend integration.

When Submit Pipeline is clicked:

1. Reads nodes and edges from Zustand.
2. Sends them to /pipelines/parse.
3. Validates the backend response.
4. Shows an alert with num_nodes, num_edges, and is_dag.

## Node System

### src/nodes/BaseNode.js

Core node abstraction.

It handles:

- shared node layout
- headers
- fields
- input/output handles
- field updates
- dynamic variable extraction
- dynamic handles
- React Flow internal updates

Important functions:

- extractTemplateVariables(text)
- createNodeComponent(definition)

### src/nodes/nodeDefinitions.js

Defines all node types in one registry.

Original nodes:

- Input
- Text
- LLM
- Output

Additional demo nodes:

- Transform
- Filter
- API
- Database
- Condition

The Text node definition includes textarea input, auto-sizing, default text, and variable-handle support.

### src/nodes/inputNode.js

Creates the Input node from the shared abstraction.

### src/nodes/outputNode.js

Creates the Output node from the shared abstraction.

### src/nodes/llmNode.js

Creates the LLM node from the shared abstraction.

### src/nodes/textNode.js

Creates the Text node from the shared abstraction.

### src/nodes/utilityNodes.js

Creates the additional demo nodes:

- Transform
- Filter
- API
- Database
- Condition

## Text Node Logic

The Text node supports auto-resizing and dynamic variables.

As the user types, the node recalculates:

- width
- minimum height
- textarea height

When the user types:

Hello {{ customerName }}

the app creates a left-side input handle called customerName.

Rules:

- variable must be inside double curly braces
- variable must be a valid JavaScript identifier
- duplicate variables create only one handle
- reserved JavaScript keywords are ignored

## Backend File Guide

### backend/main.py

FastAPI backend.

It defines:

- FastAPI app
- CORS middleware
- request models
- root health endpoint
- DAG helper
- /pipelines/parse endpoint

The endpoint receives:

{
  "nodes": [],
  "edges": []
}

It returns:

{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": true
}

## DAG Checking Logic

The backend uses Kahn's algorithm.

Process:

1. Collect node IDs.
2. Reject duplicate node IDs.
3. Build adjacency list.
4. Count indegrees.
5. Reject edges that reference missing nodes.
6. Start from nodes with indegree 0.
7. Visit nodes and reduce neighbor indegrees.
8. If all nodes are visited, graph is a DAG.
9. If not, graph contains a cycle.

## End-To-End Integration

1. User creates a pipeline.
2. User clicks Submit Pipeline.
3. Frontend sends nodes and edges to backend.
4. Backend parses payload.
5. Backend calculates num_nodes, num_edges, and is_dag.
6. Backend returns JSON.
7. Frontend displays an alert.

## Notes

- Backend CORS is enabled for local frontend requests.
- REACT_APP_API_URL can point frontend to a different backend.
- Pipeline creation is frontend-driven.
- Pipeline analysis is backend-driven.