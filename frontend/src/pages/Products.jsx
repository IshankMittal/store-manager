/*
==========================================
PRODUCTS PAGE

Purpose:
Display all products.

API:
GET /products
==========================================
*/

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

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

  const searchProducts = async (value) => {
    try {
      const response = await api.get(
        `/products/search?q=${value}`
      );

      setProducts(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {

      const response = await api.get(
        "/products"
      );

      const sortedProducts =
        response.data.sort(
          (a, b) =>
            Number(b.is_favorite) -
            Number(a.is_favorite)
        );

      setProducts(sortedProducts);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {

  if (location.state?.message) {

    setMessage(location.state.message);
    setMessageType(location.state.type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }

}, []);

  return (
    <div>

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

      <AddProductForm
        onProductAdded={() => {
          fetchProducts();

          showMessage(
            "Product added successfully!",
            "success"
          );
        }}
      />

      <div className="mt-10">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);

              if (value.trim() === "") {
                fetchProducts();
              } else {
                searchProducts(value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6">
          Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavoriteChange={fetchProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;