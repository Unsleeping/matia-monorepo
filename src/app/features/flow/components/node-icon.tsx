import { Database } from 'lucide-react';

interface NodeIconProps {
  source?: string;
}

export function NodeIcon({ source }: NodeIconProps) {
  return source === 'snowflake' ? (
    <span className="text-blue-500" role="img" aria-label="snowflake">
      ❄️
    </span>
  ) : (
    <Database className="w-4 h-4 text-blue-600" />
  );
}
