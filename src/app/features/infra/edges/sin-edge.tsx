import { BaseEdge } from '@xyflow/react';

import { EdgeProps } from '@xyflow/react';

export const SinEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) => {
  const centerX = (targetX - sourceX) / 2 + sourceX;
  const centerY = (targetY - sourceY) / 2 + sourceY;

  const edgePath = `
  M ${sourceX} ${sourceY} 
  Q ${(targetX - sourceX) * 0.2 + sourceX} ${
    targetY * 1.1
  } ${centerX} ${centerY}
  Q ${(targetX - sourceX) * 0.8 + sourceX} ${
    sourceY * 0.9
  } ${targetX} ${targetY}
  `;

  return <BaseEdge id={id} path={edgePath} />;
};
