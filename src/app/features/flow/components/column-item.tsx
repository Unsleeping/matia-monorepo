import { cn } from 'src/app/lib/utils';
import { DataColumn } from '../lib/store';
import { ColumnIcon } from './column-icon';

export const ColumnItem = ({
  column,
  isSelected,
  onClick,
}: {
  column: DataColumn;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 cursor-pointer border-blue-500 border rounded-md p-2',
        !isSelected && 'border-dashed'
      )}
      onClick={onClick}
    >
      <ColumnIcon column={column} />
      <span className="text-gray-700">{column.name}</span>
    </div>
  );
};
