import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function HistoryPage() {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {

    const loadData = async () => {

      const productResponse = await api.get(
        `/products/${id}`
      );

      const transactionResponse = await api.get(
        `/products/${id}/transactions`
      );

      setProduct(productResponse.data);
      setTransactions(transactionResponse.data);
    };

    loadData();

  }, [id]);

  if (!product) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Full Transaction History
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6">

        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="border-b border-gray-200 py-3"
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

    </div>
  );
}

export default HistoryPage;