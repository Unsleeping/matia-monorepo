import { createFileRoute } from '@tanstack/react-router';
import { InfraPage } from 'src/app/features/infra';

export const Route = createFileRoute('/playground')({
  component: InfraPage,
});
