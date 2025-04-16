import { Plug, HdmiPort } from 'lucide-react';
import { HandleProps, Handle } from '@xyflow/react';
import { cn } from 'src/app/lib/utils';

export const CustomHandle = (props: HandleProps) => {
  const iconClassName = 'w-4 h-4 text-white pointer-events-none';
  const icon =
    props.type === 'source' ? (
      <Plug className={cn(iconClassName, 'rotate-180')} />
    ) : (
      <HdmiPort className={iconClassName} />
    );
  return (
    <Handle
      {...props}
      className={cn(
        '!w-6 !h-6 !bg-gray-500 flex items-center justify-center',
        props.type === 'source' && '!bg-red-500',
        props.type === 'target' && '!bg-blue-500'
      )}
    >
      {icon}
    </Handle>
  );
};
