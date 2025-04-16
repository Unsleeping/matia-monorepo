import { Route, Routes } from 'react-router-dom';
import { RootPage } from './pages/root-page';
import { InfraPage } from './features/infra';

export function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/infra" element={<InfraPage />} />
      </Routes>
    </main>
  );
}

export default App;
