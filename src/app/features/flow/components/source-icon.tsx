import { Database } from 'lucide-react';
import { DataNodeData } from '../lib/store';

export const SourceIcon = ({ source }: { source: DataNodeData['source'] }) => {
  switch (source) {
    case 'snowflake':
      return (
        <span className="text-blue-500" role="img" aria-label="snowflake">
          ❄️
        </span>
      );
    case 'postgres':
      return <Database className="w-4 h-4 text-blue-600" />;
    default:
      return <Database className="w-4 h-4 text-gray-600" />;
  }
};
