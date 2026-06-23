/*
==========================================
STOCK FORM

Purpose:
Add or remove inventory stock.

API:
POST /stock/in
POST /stock/out
==========================================
*/

import { useState } from "react";
import api from "../services/api";

function StockForm({
  productId,
  type,
  onSuccess,
  showMessage
}) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {
      await api.post(
        type === "IN"
          ? "/stock/in"
          : "/stock/out",
        {
          product_id: productId,
          quantity: Number(quantity),
          note: note
        }
      );

      setQuantity("");
      setNote("");

      showMessage(
        "Stock updated successfully",
        "success"
      );

      onSuccess();

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Operation failed"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h3 className="text-2xl font-bold">
        {type === "IN"
          ? "Add Stock"
          : "Remove Stock"}
      </h3>

      <div>
        <label className="block text-gray-700 mb-2">
          Quantity
        </label>

        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">
          Note
        </label>

        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className={
          type === "IN"
            ? "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
            : "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
        }
      >
        {type === "IN"
          ? "Add Stock"
          : "Remove Stock"}
      </button>
    </form>
  );
}

export default StockForm;