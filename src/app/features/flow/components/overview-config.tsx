'use client';

import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useFlowStore } from '../lib/store';
import { Button } from 'src/app/ui/button';
import DataSourcesPanel from './data-sources-panel';
import NodeConfigurationPanel from './node-configuration-panel';
import ConnectionsPanel from './connections-panel';
import { useQueryClient } from '@tanstack/react-query';

export default function OverviewConfig() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataSourcesPanel
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />

        <NodeConfigurationPanel selectedNodeId={selectedNodeId} />

        <ConnectionsPanel />
      </div>
    </div>
  );
}
