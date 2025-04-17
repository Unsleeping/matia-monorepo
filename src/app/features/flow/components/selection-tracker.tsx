import { DataNode } from '../lib/store';

import { useCallback } from 'react';
import { useFlowStore } from '../lib/store';

import { FlowState } from '../lib/store';
import { useShallow } from 'zustand/react/shallow';
import { useOnSelectionChange } from '@xyflow/react';

const selector = (state: FlowState) => ({
  setSelectedNodeId: state.setSelectedNodeId,
});

export const SelectionTracker = () => {
  const { setSelectedNodeId } = useFlowStore(useShallow(selector));

  const onChange = useCallback(
    ({ nodes }: { nodes: DataNode[] }) => {
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        setSelectedNodeId(lastNode.id);
      }
    },
    [setSelectedNodeId]
  );

  useOnSelectionChange({
    onChange,
  });

  return null;
};
