'use client';

import { Database, Trash2, Check, AlertTriangle } from 'lucide-react';
import { useNodes, useDeleteNode } from '../lib/api';
import { useFlowStore } from '../lib/store';

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

interface DataSourcesPanelProps {
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export default function DataSourcesPanel({
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
        <ScrollArea className="h-[460px] pr-4 overflow-y-auto">
          {isNodesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="p-3 border rounded-md h-[86px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nodes?.map((node) => (
                <div
                  key={node.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedNodeId === node.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {node.data.source === 'snowflake' ? (
                        <span
                          className="text-blue-500"
                          role="img"
                          aria-label="snowflake"
                        >
                          ❄️
                        </span>
                      ) : (
                        <Database className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-medium">{node.data.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {node.data.status === 'ok' && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {node.data.status === 'error' && (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            !
                          </span>
                        </div>
                      )}
                      {node.data.status === 'warning' && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <AlertTriangle className="w-3 h-3 text-white" />
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {node.data.columns.length} columns •{' '}
                    {selectedColumns[node.id]?.length
                      ? `${selectedColumns[node.id].length} selected`
                      : 'All visible'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
