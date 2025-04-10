'use client';

import {
  RefreshCw,
  Database,
  Check,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import {
  useEdges,
  useNodes,
  useUpdateNodeColumns,
  useUpdateNode,
  useDeleteNode,
  useDeleteEdge,
} from '../lib/api';
import { DataColumn, useFlowStore } from '../lib/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/app/ui/card';
import { Button } from 'src/app/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/app/ui/select';
import { ScrollArea } from 'src/app/ui/scroll-area';
import { Label } from 'src/app/ui/label';
import { Checkbox } from 'src/app/ui/checkbox';

export default function OverviewConfig() {
  const {
    data: nodes,
    isLoading: isNodesLoading,
    refetch: refetchNodes,
  } = useNodes();
  const {
    data: edges,
    isLoading: isEdgesLoading,
    refetch: refetchEdges,
  } = useEdges();
  const { mutate: updateNode } = useUpdateNode();
  const { mutate: deleteNode } = useDeleteNode();
  const { mutate: deleteEdge } = useDeleteEdge();
  const { mutate: updateNodeColumns } = useUpdateNodeColumns();

  const {
    selectedColumns,
    toggleColumnSelection,
    updateNodeStatus,
    resetToDefault,
    removeNode,
    removeEdge,
  } = useFlowStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Refetch data when component mounts to ensure we have the latest state
  useEffect(() => {
    refetchNodes();
    refetchEdges();
  }, [refetchNodes, refetchEdges]);

  const selectedNode =
    nodes?.find((node) => node.id === selectedNodeId) || null;

  const handleStatusChange = (
    nodeId: string,
    status: 'ok' | 'error' | 'warning'
  ) => {
    updateNodeStatus(nodeId, status);

    // Also update via React Query
    const node = nodes?.find((n) => n.id === nodeId);
    if (node) {
      updateNode({
        ...node,
        data: {
          ...node.data,
          status,
        },
      });
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    deleteNode(nodeId);
    removeNode(nodeId);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const handleDeleteEdge = (edgeId: string) => {
    deleteEdge(edgeId);
    removeEdge(edgeId);
  };

  // Fixed column toggle function to preserve other selections
  const handleColumnToggle = (nodeId: string, columnName: string) => {
    toggleColumnSelection(nodeId, columnName);
  };

  const handleReset = () => {
    resetToDefault();
    // Reload the page to reset React Query cache
    window.location.reload();
  };

  if (isNodesLoading || isEdgesLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

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
        {/* Data Sources Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>
              Configure your data sources and their properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px] pr-4 overflow-y-auto">
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
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Node Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Node Configuration</CardTitle>
            <CardDescription>
              {selectedNode
                ? `Configure ${selectedNode.data.label}`
                : 'Select a node to configure'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="node-status">Status</Label>
                  <Select
                    value={selectedNode.data.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        selectedNode.id,
                        value as 'ok' | 'error' | 'warning'
                      )
                    }
                  >
                    <SelectTrigger id="node-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="ok">OK</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Visible Columns</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {selectedNode.data.columns.map((column: DataColumn) => (
                      <div
                        key={column.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`column-${column.name}`}
                          checked={
                            !selectedColumns[selectedNode.id] ||
                            selectedColumns[selectedNode.id].length === 0 ||
                            selectedColumns[selectedNode.id].includes(
                              column.name
                            )
                          }
                          onCheckedChange={() =>
                            handleColumnToggle(selectedNode.id, column.name)
                          }
                        />
                        <Label
                          htmlFor={`column-${column.name}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {column.name}
                          <span className="ml-2 text-xs text-gray-500">
                            ({column.type})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    {selectedColumns[selectedNode.id]?.length
                      ? `${
                          selectedColumns[selectedNode.id].length
                        } columns selected`
                      : 'All columns visible'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                Select a node from the list to configure
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connections Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>
              Manage data flow connections between nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
