import { ReactFlowProvider } from '@xyflow/react';
import { Flow } from './components/flow';

export function InfraPage() {
  return (
    <div className="container px-6 mx-auto py-2">
      <h1 className="text-2xl font-bold mb-2">Infrastructure Flow</h1>
      <div className="h-[500px] w-full border border-gray-300 rounded-lg p-4">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
