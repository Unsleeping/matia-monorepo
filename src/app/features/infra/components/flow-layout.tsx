import { ReactFlowProvider } from '@xyflow/react';
import { Flow } from './flow';

import '@xyflow/react/dist/style.css';

export function FlowLayout() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
