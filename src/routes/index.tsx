import { createFileRoute } from '@tanstack/react-router';
import { RootPage } from 'src/app/pages/root-page';

export const Route = createFileRoute('/')({
  component: RootPage,
});
