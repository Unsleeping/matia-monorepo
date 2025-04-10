import OverviewConfig from '../features/flow/components/overview-config';

export function RootPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 bg-gray-50">
        <OverviewConfig />
      </div>
    </main>
  );
}
