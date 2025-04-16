export const mockNodes = [
  {
    id: 'parent1',
    position: { x: 300, y: 50 },
    data: { label: 'Parent 1 label' },
    type: 'parent',
  },
  {
    id: 'child1',
    position: { x: 0, y: 300 },
    data: { label: 'Children 1 label' },
    type: 'child',
  },
  {
    id: 'child2',
    position: { x: 300, y: 300 },
    data: { label: 'Children 2 label' },
    type: 'child',
  },

  {
    id: 'child3',
    position: { x: 600, y: 300 },
    data: { label: 'Children 3 label' },
    type: 'child',
  },
];

export const mockEdges = [
  {
    id: 'e_parent1_child1',
    source: 'parent1',
    target: 'child1',
    sourceHandle: 'parent-left',
    animated: true,
  },
  {
    id: 'e_parent1_child2',
    source: 'parent1',
    target: 'child2',
    sourceHandle: 'parent-middle',
    animated: true,
    type: 'custom',
  },
  {
    id: 'e_parent1_child3',
    source: 'parent1',
    target: 'child3',
    sourceHandle: 'parent-right',
    animated: true,
    type: 'sin',
  },
];
