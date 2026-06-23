/*
==========================================
PRODUCT CARD COMPONENT

Purpose:
Display a single product.

Props:
product

Example:
{
    id: 1,
    name: "Steel Spoon",
    current_quantity: 40,
    unit: "pcs"
}

Future:
- View Details
- Edit Product
- Delete Product
==========================================
*/

import { Link } from "react-router-dom";
import api from "../services/api";

function ProductCard({
  product,
  onFavoriteChange
})  {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 min-h-[220px] flex flex-col justify-between">

      <div className="flex justify-between items-center mb-4">

        <h3 className="text-2xl font-semibold text-gray-800">
          {product.name}
        </h3>

        <button
          onClick={async () => {
            try {

              await api.put(
                `/products/${product.id}/favorite`
              );

              onFavoriteChange();

            } catch (error) {
              console.error(error);
            }
          }}
          className="text-3xl"
        >
          {product.is_favorite ? "⭐" : "☆"}
        </button>

      </div>

      <p className="text-gray-600 mb-6">
        Current Stock:
        <span className="font-bold ml-2">
          {product.current_quantity} {product.unit}
        </span>
      </p>

      <Link to={`/products/${product.id}`}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          View Details
        </button>
      </Link>

    </div>
  );
}

export default ProductCard;