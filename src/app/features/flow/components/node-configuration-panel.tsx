import { DataColumn, FlowState, useFlowStore } from '../lib/store';

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
import { NodeStatus } from './node-status';
import { NodeIcon } from './node-icon';
import { useShallow } from 'zustand/react/shallow';

interface NodeConfigurationPanelProps {
  selectedNodeId: string | null;
}

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  selectedColumns: state.selectedColumns,
  toggleColumnSelection: state.toggleColumnSelection,
  updateNodeStatus: state.updateNodeStatus,
});

export function NodeConfigurationPanel({
  selectedNodeId,
}: NodeConfigurationPanelProps) {
  const {
    nodes,
    selectedColumns: allSelectedColumns,
    toggleColumnSelection,
    updateNodeStatus,
  } = useFlowStore(useShallow(selector));

  const selectedNode =
    nodes?.find((node) => node.id === selectedNodeId) || null;

  let selectedColumns: string[] = [];
  if (selectedNodeId) {
    selectedColumns = allSelectedColumns.get(selectedNodeId) || [];
  }

  const handleStatusChange = (
    nodeId: string,
    status: 'ok' | 'error' | 'warning'
  ) => {
    updateNodeStatus(nodeId, status);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedNode && (
            <div className="flex items-center gap-2">
              <NodeIcon source={selectedNode.data.source} />
              <span>{selectedNode.data.label}</span>
            </div>
          )}
          {!selectedNode && 'Node Configuration'}
        </CardTitle>
        <CardDescription>
          {selectedNode
            ? `Configure node properties and visible columns`
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
              <NodeStatus status={selectedNode.data.status} />
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
                      checked={selectedColumns.includes(column.name)}
                      onCheckedChange={() => {
                        if (selectedNodeId) {
                          toggleColumnSelection(selectedNodeId, column.name);
                        }
                      }}
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
                {selectedColumns.length > 0 &&
                  `${selectedColumns.length} columns selected`}
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
