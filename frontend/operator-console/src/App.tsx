import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AgentsPage from "./pages/AgentsPage";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-6 py-3">
        <h1 className="text-xl font-semibold">AuthKnot</h1>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agents" element={<AgentsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
