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
  selectedColumns?: string[];
};

export type DataNode = Node<DataNodeData, 'dataSource'>;

export type DataEdge = Edge;

export type FlowState = {
  nodes: DataNode[];
  edges: DataEdge[];
  expandedNodes: Set<string>;
  selectedColumns: Map<string, string[]>;
  isLoading: boolean;

  // Actions
  toggleNodeExpansion: (nodeId: string) => void;
  updateNodeStatus: (
    nodeId: string,
    status: 'ok' | 'error' | 'warning'
  ) => void;
  updateNodeColumns: (nodeId: string, columns: DataColumn[]) => void;
  toggleColumnSelection: (nodeId: string, columnName: string) => void;
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
  expandedNodes: new Set<string>(),
  selectedColumns: new Map<string, string[]>(),
  isLoading: false,

  toggleNodeExpansion: (nodeId) => {
    const expandedNodes = new Set(get().expandedNodes);
    const currentExpanded = expandedNodes.has(nodeId);

    if (currentExpanded) {
      expandedNodes.delete(nodeId);
    } else {
      expandedNodes.add(nodeId);
    }

    set((state) => ({
      expandedNodes: expandedNodes,
    }));
  },

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
      const currentSelected = state.selectedColumns.get(nodeId) || [];
      const newSelected = currentSelected.includes(columnName)
        ? currentSelected.filter((name) => name !== columnName)
        : [...currentSelected, columnName];

      return {
        selectedColumns: state.selectedColumns.set(nodeId, newSelected),
      };
    }),

  resetToDefault: () =>
    set({
      nodes: mockConfig.nodes,
      edges: mockConfig.edges,
      expandedNodes: new Set<string>(),
      selectedColumns: new Map<string, string[]>(),
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
