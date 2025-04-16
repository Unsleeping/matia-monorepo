import { Handle, Position } from '@xyflow/react';

export const CustomNodeParent = () => {
  return (
    <div className="rounded-xl border px-6 h-40 bg-blue-200">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium mt-4">Parent Node</div>
        <div className="text-sm text-gray-500">
          Custom Parent Node Description
        </div>
        <Handle type="source" position={Position.Bottom} id="parent-middle" />
        <Handle
          type="source"
          position={Position.Bottom}
          id="parent-left"
          className="!left-[10%]"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="parent-right"
          className="!left-[90%]"
        />
        <Handle type="target" position={Position.Top} id="parent-top" />
      </div>
    </div>
  );
};
