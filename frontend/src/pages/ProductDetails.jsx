/*
==========================================
PRODUCT DETAILS PAGE

Purpose:
Display product information and
transaction history.

Features:
✓ View Product Details
✓ View Transaction History
✓ Add Stock
✓ Remove Stock

API:
GET /products/<id>
GET /products/<id>/transactions
POST /stock/in
POST /stock/out
==========================================
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import StockForm from "../components/StockForm";
import api from "../services/api";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id;

  const loadProduct = async () => {
    try {
      const productResponse = await api.get(
        `/products/${productId}`
      );

      const transactionResponse = await api.get(
        `/products/${productId}/transactions`
      );

      setProduct(productResponse.data);
      setEditName(productResponse.data.name);
      setEditUnit(productResponse.data.unit);
      setTransactions(transactionResponse.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const refreshData = () => {
    loadProduct();
  };

  const deleteProduct = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/products/${productId}`
      );

      navigate("/", {
        state: {
          message: "Product deleted successfully",
          type: "delete"
        }
      });

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Delete failed"
      );

    }
  };

  const showMessage = (text, type) => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setMessage(text);
  setMessageType(type);

  setTimeout(() => {
    setMessage("");
    setMessageType("");
  }, 3000);
};

  const updateProduct = async () => {

    try {

      await api.put(
        `/products/${productId}`,
        {
          name: editName,
          unit: editUnit
        }
      );

      showMessage(
        "Product updated successfully",
        "success"
      );

      setIsEditing(false);

      loadProduct();

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Update failed"
      );

    }
  };

  if (!product) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-white ${
                messageType === "delete"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {message}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-3 mb-4">

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                value={editUnit}
                onChange={(e) =>
                  setEditUnit(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />

              <button
                onClick={updateProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Save Changes
              </button>

            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-2">
              {product.name}
            </h1>
          )}

          <p className="text-xl text-gray-600">
            Current Stock:
            <span className="font-bold ml-2">
              {product.current_quantity} {product.unit}
            </span>
          </p>

          <button
            onClick={() =>
              setIsEditing(!isEditing)
            }
            className="mt-4 mr-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            {isEditing
              ? "Cancel"
              : "Edit Product"}
          </button>

          <button
            onClick={deleteProduct}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Delete Product
          </button>
        </div>

        {/* Stock Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-xl shadow-md p-6">
            <StockForm
              productId={productId}
              type="IN"
              onSuccess={refreshData}
              showMessage={showMessage}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <StockForm
              productId={productId}
              type="OUT"
              onSuccess={refreshData}
              showMessage={showMessage}
            />
          </div>

        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-4">
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions found.
            </p>
          ) : (
            <div className="space-y-3">

              {transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-3"
                >
                  {transaction.created_at}
                  {" | "}

                  {transaction.type === "IN"
                    ? `Added ${transaction.quantity} ${product.unit}`
                    : `Removed ${transaction.quantity} ${product.unit}`}

                  {transaction.note
                    ? ` | ${transaction.note}`
                    : ""}
                </div>
              ))}

            </div>
          )}

          {transactions.length > 5 && (
            <Link to={`/products/${productId}/history`}>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                View Full History
              </button>
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;