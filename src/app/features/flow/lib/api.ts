import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DataNode,
  DataEdge,
  // DataColumn
} from './store';
import { mockConfig } from './mock-data';

// Simulate API calls with mock data
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
async function fetchNodes(): Promise<DataNode[]> {
  await delay(500); // Simulate network delay
  return mockConfig.nodes as DataNode[];
}

async function fetchEdges(): Promise<DataEdge[]> {
  await delay(300);
  return mockConfig.edges as DataEdge[];
}

async function updateNode(node: DataNode): Promise<DataNode> {
  await delay(400);
  return node;
}

async function deleteNode(nodeId: string): Promise<string> {
  await delay(300);
  return nodeId;
}

async function updateEdge(edge: DataEdge): Promise<DataEdge> {
  await delay(200);
  return edge;
}

async function deleteEdge(edgeId: string): Promise<string> {
  await delay(200);
  return edgeId;
}

// async function updateNodeColumns(
//   nodeId: string,
//   columns: DataColumn[]
// ): Promise<{ nodeId: string; columns: DataColumn[] }> {
//   await delay(300);
//   return { nodeId, columns };
// }

// React Query hooks
export function useNodes() {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: fetchNodes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEdges() {
  return useQuery({
    queryKey: ['edges'],
    queryFn: fetchEdges,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNode,
    onSuccess: (updatedNode) => {
      queryClient.setQueryData(
        ['nodes'],
        (oldNodes: DataNode[] | undefined) => {
          if (!oldNodes) return [updatedNode];
          return oldNodes.map((node) =>
            node.id === updatedNode.id ? updatedNode : node
          );
        }
      );
    },
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNode,
    onSuccess: (deletedNodeId) => {
      queryClient.setQueryData(
        ['nodes'],
        (oldNodes: DataNode[] | undefined) => {
          if (!oldNodes) return [];
          return oldNodes.filter((node) => node.id !== deletedNodeId);
        }
      );

      // Also remove any edges connected to this node
      queryClient.setQueryData(
        ['edges'],
        (oldEdges: DataEdge[] | undefined) => {
          if (!oldEdges) return [];
          return oldEdges.filter(
            (edge) =>
              edge.source !== deletedNodeId && edge.target !== deletedNodeId
          );
        }
      );
    },
  });
}

export function useUpdateEdge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEdge,
    onSuccess: (updatedEdge) => {
      queryClient.setQueryData(
        ['edges'],
        (oldEdges: DataEdge[] | undefined) => {
          if (!oldEdges) return [updatedEdge];
          return oldEdges.map((edge) =>
            edge.id === updatedEdge.id ? updatedEdge : edge
          );
        }
      );
    },
  });
}

export function useDeleteEdge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEdge,
    onSuccess: (deletedEdgeId) => {
      queryClient.setQueryData(
        ['edges'],
        (oldEdges: DataEdge[] | undefined) => {
          if (!oldEdges) return [];
          return oldEdges.filter((edge) => edge.id !== deletedEdgeId);
        }
      );
    },
  });
}

export function useUpdateNodeColumns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      // updateNodeColumns()
      return Promise.resolve({ nodeId: '1', columns: [] });
    },
    onSuccess: ({ nodeId, columns }) => {
      queryClient.setQueryData(
        ['nodes'],
        (oldNodes: DataNode[] | undefined) => {
          if (!oldNodes) return [];
          return oldNodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, columns } }
              : node
          );
        }
      );
    },
  });
}
