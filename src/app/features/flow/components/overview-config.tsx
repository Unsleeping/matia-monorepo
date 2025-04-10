import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useFlowStore } from '../lib/store';
import { Button } from 'src/app/ui/button';
import { DataSourcesPanel } from './data-sources-panel';
import { NodeConfigurationPanel } from './node-configuration-panel';
import { ConnectionsPanel } from './connections-panel';
import { useQueryClient } from '@tanstack/react-query';
import { LineageFlow } from './lineage-flow';

export function OverviewConfig() {
  const queryClient = useQueryClient();
  const { resetToDefault } = useFlowStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleReset = () => {
    resetToDefault();

    queryClient.invalidateQueries({ queryKey: ['nodes'] });
    queryClient.invalidateQueries({ queryKey: ['edges'] });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Lineage Configuration</h1>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <DataSourcesPanel
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />

        <div className="flex justify-center items-center">
          <img src="/matia-logo.svg" alt="matia-logo" className="w-1/2" />
        </div>

        <NodeConfigurationPanel selectedNodeId={selectedNodeId} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <LineageFlow />
        </div>

        <ConnectionsPanel />
      </div>
    </div>
  );
}
