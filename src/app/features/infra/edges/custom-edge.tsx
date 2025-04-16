import {
  BaseEdge,
  useReactFlow,
  EdgeProps,
  getStraightPath,
} from '@xyflow/react';

import { EdgeLabelRenderer } from '@xyflow/react';
import { OctagonX } from 'lucide-react';

export const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  id,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          bla
          <OctagonX />
        </button>
      </EdgeLabelRenderer>
    </>
  );
};
