/*
==========================================
DASHBOARD PAGE

Purpose:
Displays summary information about inventory.

Data Source:
GET /dashboard

Shows:
- Total Products
- Low Stock Products
- Total Stock Items
- Total Transactions
==========================================
*/

import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/dashboard")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-blue-100 rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-sm">
            Total Products
          </h3>

          <p className="text-4xl font-bold mt-2">
            {stats.total_products}
          </p>
        </div>

        

      </div>
    </div>
  );
}

export default Dashboard;