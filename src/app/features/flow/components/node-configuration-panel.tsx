'use client';

import { useNodes, useUpdateNode } from '../lib/api';
import { DataColumn, useFlowStore } from '../lib/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/app/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/app/ui/select';
import { Label } from 'src/app/ui/label';
import { Checkbox } from 'src/app/ui/checkbox';

interface NodeConfigurationPanelProps {
  selectedNodeId: string | null;
}

export default function NodeConfigurationPanel({
  selectedNodeId,
}: NodeConfigurationPanelProps) {
  const { data: nodes, isLoading } = useNodes();
  const { mutate: updateNode } = useUpdateNode();
  const { selectedColumns, toggleColumnSelection, updateNodeStatus } =
    useFlowStore();

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

  // Fixed column toggle function to preserve other selections
  const handleColumnToggle = (nodeId: string, columnName: string) => {
    toggleColumnSelection(nodeId, columnName);
  };

  return (
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
                        selectedColumns[selectedNode.id].includes(column.name)
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
  );
}
