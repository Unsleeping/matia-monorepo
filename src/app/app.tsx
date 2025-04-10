import { Route, Routes } from 'react-router-dom';
import { RootPage } from './pages/root-page';

export function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<RootPage />} />
      </Routes>
    </main>
  );
}

export default App;
