'use client';

import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type NodeTypes,
  type NodeProps,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  EdgeChange,
  NodeChange,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  AlertTriangle,
  Check,
  Database,
  Hash,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useDeleteEdge, useEdges, useNodes } from '../lib/api';
import { useFlowStore } from '../lib/store';
import { cn } from '../../../lib/utils';
import type { DataColumn } from '../lib/store';
// Custom node types
const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
};

export default function LineageFlow() {
  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
}

function FlowContent() {
  const { data: nodesData, isLoading: isNodesLoading } = useNodes();
  const { data: edgesData, isLoading: isEdgesLoading } = useEdges();
  const { mutate: deleteEdge } = useDeleteEdge();

  const {
    nodes: storeNodes,
    edges: storeEdges,
    expandedNodes,
    selectedColumns,
    setNodes,
    setEdges,
    toggleNodeExpansion,
    removeEdge,
  } = useFlowStore();

  const [nodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [edges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  const initialized = useRef(false);
  const positionsRef = useRef(new Map());

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
      };
      setReactFlowEdges((eds) => addEdge(newEdge as Edge, eds));

      // Update the store
      const edgeToAdd = {
        ...newEdge,
        id: `e${params.source}-${params.target}`,
        animated: true,
      };
      useFlowStore.getState().addEdge(edgeToAdd as Edge);
    },
    [setReactFlowEdges]
  );

  // Handle edge changes including deletion
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);

      // Check for edge removal changes
      const removeChanges = changes.filter(
        (change) => change.type === 'remove'
      );

      if (removeChanges.length > 0) {
        // Process edge deletions
        removeChanges.forEach((change) => {
          const edgeId = change.id;
          deleteEdge(edgeId);
          removeEdge(edgeId);
        });
      }
    },
    [onEdgesChange, deleteEdge, removeEdge]
  );

  // Initialize flow from store or API data - only run once
  useEffect(() => {
    if (initialized.current || isNodesLoading || isEdgesLoading) return;

    // Use API data if available, otherwise use store data
    const nodesToUse = nodesData || storeNodes;
    const edgesToUse = edgesData || storeEdges;

    if (nodesToUse && nodesToUse.length > 0) {
      // Save initial positions to ref for comparison
      nodesToUse.forEach((node) => {
        positionsRef.current.set(node.id, { ...node.position });
      });

      const preparedNodes = nodesToUse.map((node) => ({
        ...node,
        type: 'dataSource',
        data: {
          ...node.data,
          onToggleExpand: () => toggleNodeExpansion(node.id),
          isExpanded: !!expandedNodes[node.id],
          selectedColumns: selectedColumns[node.id] || [],
        },
      }));

      setReactFlowNodes(preparedNodes);

      // Don't update the store here to avoid loops
      if (!nodesData) {
        setNodes(preparedNodes);
      }
    }

    if (edgesToUse && edgesToUse.length > 0) {
      setReactFlowEdges(edgesToUse);

      // Don't update the store here to avoid loops
      if (!edgesData) {
        setEdges(edgesToUse);
      }
    }

    // Center the view
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    }, 100);

    initialized.current = true;
  }, [
    isNodesLoading,
    isEdgesLoading,
    nodesData,
    edgesData,
    storeNodes,
    storeEdges,
    expandedNodes,
    selectedColumns,
    setReactFlowNodes,
    setReactFlowEdges,
    setNodes,
    setEdges,
    toggleNodeExpansion,
    reactFlowInstance,
  ]);

  // Update nodes when expanded state changes
  useEffect(() => {
    if (!initialized.current) return;

    setReactFlowNodes((nds) =>
      nds.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            isExpanded: !!expandedNodes[node.id],
            selectedColumns: selectedColumns[node.id] || [],
          },
        };
      })
    );
  }, [expandedNodes, selectedColumns, setReactFlowNodes]);

  // Custom node change handler to preserve positions
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      // Track position changes
      const positionChanges = changes.filter(
        (change) => change.type === 'position' && change.dragging === false
      );

      if (positionChanges.length > 0) {
        // Update positions in our ref
        positionChanges.forEach((change) => {
          if (change.type === 'position') {
            const nodeId = change.id;
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
              positionsRef.current.set(nodeId, { ...node.position });
            }
          }
        });

        // Update store with new positions after dragging is complete
        const updatedNodes = nodes.map((node) => ({
          ...node,
          position: positionsRef.current.get(node.id) || node.position,
        }));

        setNodes(updatedNodes);
      }
    },
    [nodes, onNodesChange, setNodes]
  );

  // Add keyboard event listener for deleting selected edges
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Get the selected edges from ReactFlow
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedEdges.length > 0) {
          // Process each selected edge
          selectedEdges.forEach((edge) => {
            deleteEdge(edge.id);
            removeEdge(edge.id);
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [edges, deleteEdge, removeEdge]);

  if (isNodesLoading || isEdgesLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.5}
      maxZoom={1.5}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      edgeUpdaterRadius={10}
      edgesUpdatable={true}
      edgesFocusable={true}
      elementsSelectable={true}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls />
      <MiniMap />

      {/* Edge context menu */}
      <Panel position="top-right">
        <div className="bg-white p-2 rounded shadow-sm text-xs">
          <p>Tip: Select an edge and press Delete to remove it</p>
        </div>
      </Panel>
    </ReactFlow>
  );
}

// Custom node component for data sources
function DataSourceNode({ data, id }: NodeProps) {
  const {
    label,
    source,
    status,
    columns,
    isExpanded,
    onToggleExpand,
    alert,
    selectedColumns = [],
  } = data;

  // Status icon based on node status
  const StatusIcon = () => {
    switch (status) {
      case 'ok':
        return (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">!</span>
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  // Source icon based on data source
  const SourceIcon = () => {
    switch (source) {
      case 'snowflake':
        return (
          <span className="text-blue-500" role="img" aria-label="snowflake">
            ❄️
          </span>
        );
      case 'postgres':
        return <Database className="w-4 h-4 text-blue-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter columns based on selection if any are selected
  const displayColumns = columns.filter(
    (col: DataColumn) =>
      selectedColumns.length === 0 || selectedColumns.includes(col.name)
  );

  return (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm w-64',
        isExpanded ? 'min-h-[200px]' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400"
      />

      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SourceIcon />
            <span className="font-medium text-gray-800">{label}</span>
          </div>
          <StatusIcon />
        </div>

        {alert && (
          <div className="mt-2 p-2 bg-gray-50 rounded border text-xs text-gray-700">
            <div className="flex items-center gap-1 text-red-500 font-medium">
              <AlertTriangle className="w-3 h-3" />
              {alert.title}
            </div>
            <div>{alert.message}</div>
          </div>
        )}
      </div>

      <div className="p-3">
        <button
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          onClick={() => onToggleExpand(id)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide columns
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show columns
            </>
          )}
        </button>

        {isExpanded && displayColumns && displayColumns.length > 0 && (
          <div className="mt-3 space-y-2">
            {displayColumns.map((column: DataColumn, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded text-sm"
              >
                {column.type === 'string' && (
                  <Hash className="w-4 h-4 text-gray-500" />
                )}
                {column.type === 'date' && (
                  <Calendar className="w-4 h-4 text-gray-500" />
                )}
                {column.type === 'number' && (
                  <span className="text-gray-500 font-mono text-xs">#</span>
                )}
                <span className="text-gray-700">{column.name}</span>
              </div>
            ))}

            {displayColumns.length > 3 && (
              <button className="w-full text-center text-xs text-blue-600 mt-2">
                Show more columns
              </button>
            )}

            {selectedColumns.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                Showing {selectedColumns.length} selected columns
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
