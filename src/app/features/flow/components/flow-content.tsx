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
  // const { mutate: deleteEdge } = useDeleteEdge();

  // const {
  //   expandedNodes,
  //   selectedColumns,
  //   setNodes,
  //   setEdges,
  //   toggleNodeExpansion,
  //   removeEdge,
  // } = useFlowStore();

  // const positionsRef = useRef(new Map());

  // // Update nodes when expanded state changes
  // useEffect(() => {
  //   if (!initialized.current) return;

  //   setReactFlowNodes((nds) =>
  //     nds.map((node) => {
  //       return {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           isExpanded: !!expandedNodes[node.id],
  //           selectedColumns: selectedColumns[node.id] || [],
  //         },
  //       };
  //     })
  //   );
  // }, [expandedNodes, selectedColumns, setReactFlowNodes]);

  // Custom node change handler to preserve positions
  // const handleNodesChange: OnNodesChange<CustomNode> = useCallback(
  //   (changes) => {
  //     onNodesChange(changes);

  //     // Track position changes
  //     const positionChanges = changes.filter(
  //       (change) => change.type === 'position' && change.dragging === false
  //     );

  //     if (positionChanges.length > 0) {
  //       // Update positions in our ref
  //       positionChanges.forEach((change) => {
  //         if (change.type === 'position') {
  //           const nodeId = change.id;
  //           const node = nodes.find((n) => n.id === nodeId);
  //           if (node) {
  //             positionsRef.current.set(nodeId, { ...node.position });
  //           }
  //         }
  //       });

  //       // Update store with new positions after dragging is complete
  //       const updatedNodes = nodes.map((node) => ({
  //         ...node,
  //         position: positionsRef.current.get(node.id) || node.position,
  //       }));

  //       setNodes(updatedNodes);
  //     }
  //   },
  //   [nodes, onNodesChange, setNodes]
  // );

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
