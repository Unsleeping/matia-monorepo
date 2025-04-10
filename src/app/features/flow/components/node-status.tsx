import { Check, AlertTriangle } from 'lucide-react';

interface NodeStatusProps {
  status?: 'ok' | 'error' | 'warning';
}

export function NodeStatus({ status }: NodeStatusProps) {
  if (!status) return null;

  if (status === 'ok') {
    return (
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-white font-bold text-xs">!</span>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
        <AlertTriangle className="w-3 h-3 text-white" />
      </div>
    );
  }

  throw new Error(`Unknown status: ${status}`);
}
