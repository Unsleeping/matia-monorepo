import { AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
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
import { ColumnItem } from '../components/column-item';

export type DataSourceNodeType = Node<DataNodeData, 'dataSource'>;

const selector = (state: FlowState) => ({
  expandedNodes: state.expandedNodes,
  toggleNodeExpansion: state.toggleNodeExpansion,
  selectedColumns: state.selectedColumns,
  toggleColumnSelection: state.toggleColumnSelection,
});

export function DataSourceNode({
  data: { label, source, status, columns, alert },
  id,
  selected,
}: NodeProps<DataSourceNodeType>) {
  const {
    toggleNodeExpansion,
    expandedNodes,
    selectedColumns,
    toggleColumnSelection,
  } = useFlowStore(useShallow(selector));
  const isExpanded = expandedNodes.has(id);
  const selectedColumnsToDisplay = selectedColumns.get(id) || [];

  const displayColumns = columns.filter((col: DataColumn) =>
    selectedColumnsToDisplay.includes(col.name)
  );

  const nonSelectedColumns = columns.filter(
    (col: DataColumn) => !selectedColumnsToDisplay.includes(col.name)
  );

  return (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm w-64',
        isExpanded ? 'min-h-[200px]' : '',
        selected ? 'border-blue-500 border-2' : ''
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
              <ColumnItem
                key={index}
                column={column}
                isSelected
                onClick={() => toggleColumnSelection(id, column.name)}
              />
            ))}
          </div>
        )}

        {isExpanded && displayColumns && displayColumns.length === 0 && (
          <div className="mt-3 text-gray-500 text-sm">No columns selected</div>
        )}

        {isExpanded && nonSelectedColumns && nonSelectedColumns.length > 0 && (
          <div className="mt-6 text-gray-500 text-sm">
            <span className="font-medium">Available columns</span>
            <div className="mt-2 space-y-2">
              {nonSelectedColumns.map((column: DataColumn, index: number) => (
                <ColumnItem
                  key={index}
                  column={column}
                  isSelected={false}
                  onClick={() => toggleColumnSelection(id, column.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
