import '@xyflow/react/dist/style.css';

import { FlowContent } from './flow-content';

export function LineageFlowLayout() {
  return (
    <div className="w-full h-[calc(100vh-64px)] border-2 border-blue-500 rounded-lg">
      <FlowContent />
    </div>
  );
}
