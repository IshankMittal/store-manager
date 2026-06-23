/*
==========================================
ADD PRODUCT FORM

Purpose:
Allows users to create new inventory items.

Workflow:
User Input
    ↓
React Form
    ↓
POST /products
    ↓
SQLite Database
    ↓
Refresh Product List

Fields:
- Product Name
- Unit

Example:
Name: Rice
Unit: kg
==========================================
*/

import { useState } from "react";
import api from "../services/api";

function AddProductForm({ onProductAdded }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", {
        name,
        unit,
      });

      setName("");
      setUnit("");

      onProductAdded();
    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Failed to add product"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        Add Product
      </h2>

      {successMessage && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-700 mb-2">
            Product Name
          </label>

          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Unit
          </label>

          <input
            type="text"
            placeholder="pcs, kg, liters..."
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;