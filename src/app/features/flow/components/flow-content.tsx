// import { useRef, useCallback, useEffect } from 'react';
import {
  // useNodesState,
  // useEdgesState,
  // useReactFlow,
  // Connection,
  // Edge,
  // addEdge,
  // EdgeChange,
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  NodeTypes,
  // OnNodesChange,
} from '@xyflow/react';

// import { useFlowStore } from '../lib/store';
import { DataSourceNode } from '../nodes/data-source-node';
import { useFlowStore } from '../lib/store';
// import { DataSourceNodeType } from '../nodes/data-source-node';
const nodeTypes = {
  dataSource: DataSourceNode,
} satisfies NodeTypes;

// type CustomNode = DataSourceNodeType;
// type CustomEdge = Edge;

export function FlowContent() {
  const isLoading = useFlowStore((state) => state.isLoading);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  // const { data: nodes, isLoading: isNodesLoading } = useNodes();
  // const { data: edgesData, isLoading: isEdgesLoading } = useEdges();
  // const { mutate: deleteEdge } = useDeleteEdge();

  // const {
  //   nodes: storeNodes,
  //   edges: storeEdges,
  //   expandedNodes,
  //   selectedColumns,
  //   setNodes,
  //   setEdges,
  //   toggleNodeExpansion,
  //   removeEdge,
  // } = useFlowStore();

  // const [nodes, setReactFlowNodes, onNodesChange] = useNodesState<CustomNode>(
  //   []
  // );
  // const [edges, setReactFlowEdges, onEdgesChange] = useEdgesState<CustomEdge>(
  //   []
  // );
  // const reactFlowInstance = useReactFlow<CustomNode, CustomEdge>();
  // const initialized = useRef(false);
  // const positionsRef = useRef(new Map());

  // // Handle connection between nodes
  // const onConnect = useCallback(
  //   (params: Connection | Edge) => {
  //     const newEdge = {
  //       ...params,
  //       id: `e${params.source}-${params.target}`,
  //       animated: true,
  //     };
  //     setReactFlowEdges((eds) => addEdge(newEdge as Edge, eds));

  //     // Update the store
  //     const edgeToAdd = {
  //       ...newEdge,
  //       id: `e${params.source}-${params.target}`,
  //       animated: true,
  //     };
  //     useFlowStore.getState().addEdge(edgeToAdd as Edge);
  //   },
  //   [setReactFlowEdges]
  // );

  // // Handle edge changes including deletion
  // const handleEdgesChange = useCallback(
  //   (changes: EdgeChange[]) => {
  //     onEdgesChange(changes);

  //     // Check for edge removal changes
  //     const removeChanges = changes.filter(
  //       (change) => change.type === 'remove'
  //     );

  //     if (removeChanges.length > 0) {
  //       // Process edge deletions
  //       removeChanges.forEach((change) => {
  //         const edgeId = change.id;
  //         deleteEdge(edgeId);
  //         removeEdge(edgeId);
  //       });
  //     }
  //   },
  //   [onEdgesChange, deleteEdge, removeEdge]
  // );

  // // Initialize flow from store or API data - only run once
  // useEffect(() => {
  //   if (initialized.current || isNodesLoading || isEdgesLoading) return;

  //   // Use API data if available, otherwise use store data
  //   const nodesToUse = nodesData || storeNodes;
  //   const edgesToUse = edgesData || storeEdges;

  //   if (nodesToUse && nodesToUse.length > 0) {
  //     // Save initial positions to ref for comparison
  //     nodesToUse.forEach((node) => {
  //       positionsRef.current.set(node.id, { ...node.position });
  //     });

  //     const preparedNodes = nodesToUse.map((node) => ({
  //       ...node,
  //       type: 'dataSource',
  //       data: {
  //         ...node.data,
  //         onToggleExpand: () => toggleNodeExpansion(node.id),
  //         isExpanded: !!expandedNodes[node.id],
  //         selectedColumns: selectedColumns[node.id] || [],
  //       },
  //     }));

  //     setReactFlowNodes(preparedNodes);

  //     // Don't update the store here to avoid loops
  //     if (!nodesData) {
  //       setNodes(preparedNodes);
  //     }
  //   }

  //   if (edgesToUse && edgesToUse.length > 0) {
  //     setReactFlowEdges(edgesToUse);

  //     // Don't update the store here to avoid loops
  //     if (!edgesData) {
  //       setEdges(edgesToUse);
  //     }
  //   }

  //   // Center the view
  //   setTimeout(() => {
  //     reactFlowInstance.fitView({ padding: 0.2 });
  //   }, 100);

  //   initialized.current = true;
  // }, [
  //   isNodesLoading,
  //   isEdgesLoading,
  //   nodesData,
  //   edgesData,
  //   storeNodes,
  //   storeEdges,
  //   expandedNodes,
  //   selectedColumns,
  //   setReactFlowNodes,
  //   setReactFlowEdges,
  //   setNodes,
  //   setEdges,
  //   toggleNodeExpansion,
  //   reactFlowInstance,
  // ]);

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

  // Add keyboard event listener for deleting selected edges
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === 'Delete' || event.key === 'Backspace') {
  //       // Get the selected edges from ReactFlow
  //       const selectedEdges = edges.filter((edge) => edge.selected);

  //       if (selectedEdges.length > 0) {
  //         // Process each selected edge
  //         selectedEdges.forEach((edge) => {
  //           deleteEdge(edge.id);
  //           removeEdge(edge.id);
  //         });
  //       }
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [edges, deleteEdge, removeEdge]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      // nodes={nodes}
      // edges={edges}
      // onNodesChange={handleNodesChange}
      // onEdgesChange={handleEdgesChange}
      // onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.5}
      maxZoom={1.5}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      // edgeUpdaterRadius={10}
      // edgesUpdatable={true}
      edgesFocusable={true}
      elementsSelectable={true}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls />
      <MiniMap />

      <Panel position="top-right">
        <div className="bg-white p-2 rounded shadow-sm text-xs">
          <p>Tip: Select an edge and press Delete to remove it</p>
        </div>
      </Panel>
    </ReactFlow>
  );
}
