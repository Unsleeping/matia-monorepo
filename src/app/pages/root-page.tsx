import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import LineageFlow from '../features/flow/components/lineage-flow';
import OverviewConfig from '../features/flow/components/overview-config';

export function RootPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex border-b items-center px-4">
        <img src="/matia-logo.svg" alt="Matia" className="w-[128px] h-6" />
        <div className="container mx-auto px-4 py-4">
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lineage">Lineage</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 bg-gray-50">
        {activeTab === 'overview' ? <OverviewConfig /> : <LineageFlow />}
      </div>
    </main>
  );
}
