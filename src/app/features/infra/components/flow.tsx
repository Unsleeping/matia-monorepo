import {
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
} from '@xyflow/react';

import { EdgeTypes } from '@xyflow/react';

import { ReactFlow } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useInfraNodes } from '../hooks/use-infra-nodes';
import { useInfraEdges } from '../hooks/use-infra-edges';
import { CustomNodeChild } from '../nodes/custom-node-child';
import { CustomNodeParent } from '../nodes/custom-node-parent';
import { SinEdge } from '../edges/sin-edge';

import '@xyflow/react/dist/style.css';
import { CustomEdge } from '../edges/custom-edge';

const nodeTypes = {
  parent: CustomNodeParent,
  child: CustomNodeChild,
} satisfies NodeTypes;

const edgeTypes = {
  custom: CustomEdge,
  sin: SinEdge,
} satisfies EdgeTypes;

export function Flow() {
  const { data: nodes, isLoading: isNodesLoading } = useInfraNodes();
  const { data: edges, isLoading: isEdgesLoading } = useInfraEdges();

  if (isNodesLoading || isEdgesLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
        <p className="ml-2">Loading nodes...</p>
      </div>
    );
  }

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
    >
      <Controls position="top-left" />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}
