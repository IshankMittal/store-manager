/*
==========================================
STORE MANAGER ROUTES

Routes:
/
→ Home Page

/products/:id
→ Product Details
==========================================
*/

import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import HistoryPage from "./pages/HistoryPage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/products/:id/history"
          element={<HistoryPage />}
        />
      </Routes>
    </>
  );
}

export default App;