import { createFileRoute } from '@tanstack/react-router';
import { RootPage } from 'src/app/pages/root-page';
import { useFlowStore } from 'src/app/features/flow/lib/store';
export const Route = createFileRoute('/')({
  component: RootPage,
  loader: async () => {
    const flowStore = useFlowStore.getState();
    flowStore.fetchFlowData();
  },
});
