import { Route, Routes } from 'react-router-dom';
import { RootPage } from './pages/root-page';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />
    </Routes>
  );
}

export default App;
