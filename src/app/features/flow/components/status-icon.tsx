import { Check } from 'lucide-react';

import { AlertTriangle } from 'lucide-react';
import { DataNodeData } from '../lib/store';

export const StatusIcon = ({ status }: { status: DataNodeData['status'] }) => {
  switch (status) {
    case 'ok':
      return (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      );
    case 'error':
      return (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">!</span>
        </div>
      );
    case 'warning':
      return (
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
          <AlertTriangle className="w-3 h-3 text-white" />
        </div>
      );
    default:
      return null;
  }
};
