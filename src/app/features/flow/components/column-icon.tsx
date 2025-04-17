import { Hash, Type, Calendar } from 'lucide-react';
import { DataColumn } from '../lib/store';

export const ColumnIcon = ({ column }: { column: DataColumn }) => {
  return (
    <div className="flex items-center gap-2">
      {column.type === 'string' && (
        <Type className="w-4 h-4 text-gray-500 min-w-4" />
      )}
      {column.type === 'date' && (
        <Calendar className="w-4 h-4 text-gray-500 min-w-4" />
      )}
      {column.type === 'number' && (
        <Hash className="w-4 h-4 text-gray-500 min-w-4" />
      )}
    </div>
  );
};
