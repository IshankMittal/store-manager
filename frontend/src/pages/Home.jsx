import Dashboard from "./Dashboard";
import Products from "./Products";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-6">

        <Dashboard />

        <div className="mt-8">
          <Products />
        </div>

      </div>

    </div>
  );
}

export default Home;