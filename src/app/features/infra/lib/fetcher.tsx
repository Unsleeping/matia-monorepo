import { resolveAfter } from './utils';
import { mockNodes, mockEdges } from '../mocks/mocks';

export const fetcher = {
  getNodes: () => resolveAfter(1000).then(() => mockNodes),
  getEdges: () => resolveAfter(2000).then(() => mockEdges),
};
