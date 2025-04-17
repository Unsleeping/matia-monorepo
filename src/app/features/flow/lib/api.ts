import type { DataNode, DataEdge } from './store';
import { mockConfig } from './mock-data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchNodes(): Promise<DataNode[]> {
  console.log('fetchNodes');
  await delay(1500);
  return mockConfig.nodes;
}

export async function fetchEdges(): Promise<DataEdge[]> {
  console.log('fetchEdges');
  await delay(2300);
  return mockConfig.edges;
}
