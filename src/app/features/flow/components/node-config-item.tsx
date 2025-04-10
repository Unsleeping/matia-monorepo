import { Trash2 } from 'lucide-react';
import { Button } from 'src/app/ui/button';
import { NodeStatus } from './node-status';
import { NodeIcon } from './node-icon';
import { DataNode } from '../lib/store';

interface NodeConfigItemProps {
  node: DataNode;
  selectedNodeId: string | null;
  selectedColumns: Record<string, string[]>;
  onSelect: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeConfigItem({
  node,
  selectedNodeId,
  selectedColumns,
  onSelect,
  onDelete,
}: NodeConfigItemProps) {
  return (
    <div
      className={`p-3 border rounded-md cursor-pointer transition-colors ${
        selectedNodeId === node.id
          ? 'border-blue-500 bg-blue-50'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect(node.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NodeIcon source={node.data.source} />
          <span className="font-medium">{node.data.label}</span>
        </div>

        <div className="flex items-center gap-2">
          <NodeStatus status={node.data.status} />

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
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
  );
}
