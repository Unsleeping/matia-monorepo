import { create } from 'zustand';

import { mockConfig } from './mock-data';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Connection,
} from '@xyflow/react';
import { fetchNodes, fetchEdges } from './api';

export type DataColumn = {
  name: string;
  type: string;
  selected?: boolean;
};

export type DataNodeData = {
  label: string;
  source: string;
  status: 'ok' | 'error' | 'warning';
  columns: DataColumn[];
  alert?: {
    title: string;
    message: string;
  };
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
  selectedColumns?: string[];
};

export type DataNode = Node<DataNodeData, 'dataSource'>;

export type DataEdge = Edge & {
  // Add any custom edge properties here
};

export type FlowState = {
  nodes: DataNode[];
  edges: DataEdge[];
  expandedNodes: Record<string, boolean>;
  selectedColumns: Record<string, string[]>;
  isLoading: boolean;

  // Actions
  setNodes: (nodes: DataNode[]) => void;
  setEdges: (edges: DataEdge[]) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  updateNodeStatus: (
    nodeId: string,
    status: 'ok' | 'error' | 'warning'
  ) => void;
  updateNodeColumns: (nodeId: string, columns: DataColumn[]) => void;
  toggleColumnSelection: (nodeId: string, columnName: string) => void;
  addNode: (node: DataNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: DataEdge) => void;
  removeEdge: (edgeId: string) => void;
  resetToDefault: () => void;

  // TODO: refactor to divide from react-flow and custom actions
  onNodesChange: (changes: NodeChange<DataNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  fetchFlowData: () => Promise<void>;
};

export const useFlowStore = create<FlowState>()((set, get) => ({
  nodes: [] as DataNode[],
  edges: [] as DataEdge[],
  expandedNodes: {},
  selectedColumns: {},
  isLoading: false,

  setNodes: (nodes) => {
    // Preserve positions from existing nodes
    const currentNodes = get().nodes;

    const updatedNodes = nodes.map((node) => {
      const existingNode = currentNodes.find((n) => n.id === node.id);
      if (existingNode) {
        // Keep the existing position if it exists
        return {
          ...node,
          position: node.position || existingNode.position,
        };
      }
      return node;
    });

    set({ nodes: updatedNodes });
  },

  setEdges: (edges) => set({ edges }),

  toggleNodeExpansion: (nodeId) =>
    set((state) => ({
      expandedNodes: {
        ...state.expandedNodes,
        [nodeId]: !state.expandedNodes[nodeId],
      },
    })),

  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, status } } : node
      ),
    })),

  updateNodeColumns: (nodeId, columns) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, columns } } : node
      ),
    })),

  toggleColumnSelection: (nodeId, columnName) =>
    set((state) => {
      const currentSelected = state.selectedColumns[nodeId] || [];
      const newSelected = currentSelected.includes(columnName)
        ? currentSelected.filter((name) => name !== columnName)
        : [...currentSelected, columnName];

      return {
        selectedColumns: {
          ...state.selectedColumns,
          [nodeId]: newSelected,
        },
      };
    }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  resetToDefault: () =>
    set({
      nodes: mockConfig.nodes,
      edges: mockConfig.edges,
      expandedNodes: {},
      selectedColumns: {},
    }),

  fetchFlowData: async () => {
    try {
      set({ isLoading: true });
      const [nodes, edges] = await Promise.all([fetchNodes(), fetchEdges()]);
      set({ nodes, edges });
    } catch (error) {
      console.error('Error fetching flow data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  onNodesChange: (changes: NodeChange<DataNode>[]) => {
    console.log('onNodesChange', changes);
    set({
      nodes: applyNodeChanges<DataNode>(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    console.log('onEdgesChange', changes);
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    console.log('onConnect', connection);
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));
