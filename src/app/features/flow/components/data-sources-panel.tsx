import { useFlowStore, FlowState } from '../lib/store';

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
import { useShallow } from 'zustand/react/shallow';
interface DataSourcesPanelProps {
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  isLoading: state.isLoading,
});

export function DataSourcesPanel({
  selectedNodeId,
  setSelectedNodeId,
}: DataSourcesPanelProps) {
  const { nodes, isLoading } = useFlowStore(useShallow(selector));

  const { selectedColumns, removeNode } = useFlowStore();

  const handleDeleteNode = (nodeId: string) => {
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
          {isLoading ? (
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
