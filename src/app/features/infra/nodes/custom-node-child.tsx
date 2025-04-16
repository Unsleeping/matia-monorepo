import { NodeProps, Position, Node } from '@xyflow/react';
import { CustomHandle } from '../handles/custom-handle';

type ChildNode = Node<
  {
    label: string;
  },
  'child'
>;

export const CustomNodeChild = (props: NodeProps<ChildNode>) => {
  return (
    <div className="rounded-xl border px-6 h-20 bg-red-200">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium mt-4">Child Node</div>
        <div className="text-sm text-gray-500">{props.data.label}</div>
        <CustomHandle
          type="source"
          position={Position.Bottom}
          id="child-middle"
        />
        <CustomHandle type="target" position={Position.Top} id="child-top" />
      </div>
    </div>
  );
};
