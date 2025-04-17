import { Trash2 } from 'lucide-react';

import { FlowState, useFlowStore } from '../lib/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/app/ui/card';
import { Button } from 'src/app/ui/button';
import { ScrollArea } from 'src/app/ui/scroll-area';
import { Skeleton } from 'src/app/ui/skeleton';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  isLoading: state.isLoading,
  removeEdge: state.removeEdge,
});

export function ConnectionsPanel() {
  const { nodes, edges, isLoading, removeEdge } = useFlowStore(
    useShallow(selector)
  );

  const handleDeleteEdge = (edgeId: string) => {
    removeEdge(edgeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connections</CardTitle>
        <CardDescription>
          Manage data flow connections between nodes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="p-3 border rounded-md h-[70px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {edges?.map((edge) => {
                const sourceNode = nodes?.find((n) => n.id === edge.source);
                const targetNode = nodes?.find((n) => n.id === edge.target);

                return (
                  <div key={edge.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="max-w-[250px]">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {sourceNode?.data.label}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">
                            {targetNode?.data.label}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          ID: {edge.id}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEdge(edge.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {edges?.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No connections found
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
