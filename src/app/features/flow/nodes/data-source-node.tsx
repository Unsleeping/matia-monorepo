import {
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Type,
  Calendar,
  Hash,
} from 'lucide-react';
import { Handle, NodeProps, Position, Node } from '@xyflow/react';
import { cn } from 'src/app/lib/utils';
import { Button } from 'src/app/ui/button';
import {
  DataColumn,
  DataNodeData,
  useFlowStore,
  FlowState,
} from '../lib/store';
import { SourceIcon } from '../components/source-icon';
import { StatusIcon } from '../components/status-icon';
import { useShallow } from 'zustand/react/shallow';

export type DataSourceNodeType = Node<DataNodeData, 'dataSource'>;

const selector = (state: FlowState) => ({
  expandedNodes: state.expandedNodes,
  toggleNodeExpansion: state.toggleNodeExpansion,
  selectedColumns: state.selectedColumns,
});

export function DataSourceNode({
  data: { label, source, status, columns, alert },
  id,
}: NodeProps<DataSourceNodeType>) {
  const { toggleNodeExpansion, expandedNodes, selectedColumns } = useFlowStore(
    useShallow(selector)
  );
  const isExpanded = expandedNodes.has(id);
  const columnsToDisplay = selectedColumns.get(id) || [];

  const displayColumns = columns.filter((col: DataColumn) =>
    columnsToDisplay.includes(col.name)
  );

  return (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm w-64',
        isExpanded ? 'min-h-[200px]' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400"
      />

      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SourceIcon source={source} />
            <span className="font-medium text-gray-800">{label}</span>
          </div>
          <StatusIcon status={status} />
        </div>

        {alert && (
          <div className="mt-2 p-2 bg-gray-50 rounded border text-xs text-gray-700">
            <div className="flex items-center gap-1 text-red-500 font-medium">
              <AlertTriangle className="w-3 h-3" />
              {alert.title}
            </div>
            <div>{alert.message}</div>
          </div>
        )}
      </div>

      <div className="p-3">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 nopan nodrag"
          onClick={() => toggleNodeExpansion(id)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide columns
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show columns
            </>
          )}
        </Button>

        {isExpanded && displayColumns && displayColumns.length > 0 && (
          <div className="mt-3 space-y-2">
            {displayColumns.map((column: DataColumn, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded text-sm"
              >
                {column.type === 'string' && (
                  <Type className="w-4 h-4 text-gray-500 min-w-4" />
                )}
                {column.type === 'date' && (
                  <Calendar className="w-4 h-4 text-gray-500 min-w-4" />
                )}
                {column.type === 'number' && (
                  <Hash className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-700">{column.name}</span>
              </div>
            ))}
          </div>
        )}

        {isExpanded && displayColumns && displayColumns.length === 0 && (
          <div className="mt-3 text-gray-500 text-sm">No columns selected</div>
        )}
      </div>
    </div>
  );
}
