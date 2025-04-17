import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
} from '@xyflow/react';

import { DataSourceNode } from '../nodes/data-source-node';
import { FlowState, useFlowStore } from '../lib/store';
import { useShallow } from 'zustand/react/shallow';

const nodeTypes = {
  dataSource: DataSourceNode,
} satisfies NodeTypes;

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  isLoading: state.isLoading,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export function FlowContent() {
  const { nodes, edges, isLoading, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore(useShallow(selector));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
