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
  // custom state to control UI inside custom flow nodes
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  selectedColumns: Map<string, string[]>;
  isLoading: boolean;

  // custom actions to control UI inside custom flow nodes
  toggleNodeExpansion: (nodeId: string) => void;
  updateNodeStatus: (
    nodeId: string,
    status: 'ok' | 'error' | 'warning'
  ) => void;
  updateNodeColumns: (nodeId: string, columns: DataColumn[]) => void;
  toggleColumnSelection: (nodeId: string, columnName: string) => void;
  resetToDefault: () => void;
  setSelectedNodeId: (nodeId: string | null) => void;

  // custom actions to update flow state outside of react-flow
  removeEdge: (edgeId: string) => void;
  removeNode: (nodeId: string) => void;

  // custom actions to load flow data from external source
  fetchFlowData: () => Promise<void>;

  // react flow controlled state
  nodes: DataNode[];
  edges: DataEdge[];

  // react flow controlled actions
  onNodesChange: (changes: NodeChange<DataNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
};

export const useFlowStore = create<FlowState>()((set, get) => ({
  nodes: [] as DataNode[],
  edges: [] as DataEdge[],
  expandedNodes: new Set<string>(),
  selectedColumns: new Map<string, string[]>(),
  isLoading: false,
  selectedNodeId: null,

  // custom actions to control UI inside custom flow nodes
  toggleNodeExpansion: (nodeId) => {
    const expandedNodes = new Set(get().expandedNodes);
    const currentExpanded = expandedNodes.has(nodeId);

    if (currentExpanded) {
      expandedNodes.delete(nodeId);
    } else {
      expandedNodes.add(nodeId);
    }

    set(() => ({
      expandedNodes,
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
      const map = new Map(state.selectedColumns);
      const currentSelected = map.get(nodeId) || [];
      const newSelected = currentSelected.includes(columnName)
        ? currentSelected.filter((name) => name !== columnName)
        : [...currentSelected, columnName];

      return {
        selectedColumns: map.set(nodeId, newSelected),
      };
    }),

  resetToDefault: () =>
    set({
      nodes: mockConfig.nodes,
      edges: mockConfig.edges,
      expandedNodes: new Set<string>(),
      selectedColumns: new Map<string, string[]>(),
    }),

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  // load flow data from external source
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

  // react flow controlled actions
  onNodesChange: (changes: NodeChange<DataNode>[]) => {
    set({
      nodes: applyNodeChanges<DataNode>(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  // custom actions to update flow state outside of react-flow
  removeEdge: (edgeId: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },
  removeNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    }));
  },
}));
