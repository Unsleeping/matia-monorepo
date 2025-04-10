import { useNodes, useDeleteNode } from '../lib/api';
import { useFlowStore } from '../lib/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/app/ui/card';
import { ScrollArea } from 'src/app/ui/scroll-area';
import { Skeleton } from 'src/app/ui/skeleton';
import { NodeConfigItem } from './node-config-item';

interface DataSourcesPanelProps {
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export function DataSourcesPanel({
  selectedNodeId,
  setSelectedNodeId,
}: DataSourcesPanelProps) {
  const { data: nodes, isLoading: isNodesLoading } = useNodes();
  const { mutate: deleteNode } = useDeleteNode();
  const { selectedColumns, removeNode } = useFlowStore();

  const handleDeleteNode = (nodeId: string) => {
    deleteNode(nodeId);
    removeNode(nodeId);

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources</CardTitle>
        <CardDescription>
          Configure your data sources and their properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[360px] pr-4 overflow-y-auto">
          {isNodesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="p-3 border rounded-md h-[86px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nodes?.map((node) => (
                <NodeConfigItem
                  key={node.id}
                  node={node}
                  selectedNodeId={selectedNodeId}
                  selectedColumns={selectedColumns}
                  onSelect={setSelectedNodeId}
                  onDelete={handleDeleteNode}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
