import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://express-backend-example2.vercel.app/api/shopping";

const Dashboard = ( ) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("outros");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar itens");
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: newItem,
          quantity: quantity,
          category: category
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar item");
      setNewItem("");
      setQuantity(1);
      setCategory("outros");
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao deletar item");
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Minha Lista de Compras</h2>
        <button onClick={handleLogout} className="text-sm text-red-500">
          Sair
        </button>
      </div>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 border px-3 py-2"
            placeholder="Novo item"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border px-3 py-2"
            min="1"
            placeholder="Qtd"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border px-3 py-2"
          >
            <option value="alimentos">Alimentos</option>
            <option value="bebidas">Bebidas</option>
            <option value="limpeza">Limpeza</option>
            <option value="higiene">Higiene</option>
            <option value="outros">Outros</option>
          </select>
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 w-24"
          >
            Adicionar
          </button>
        </div>
      </div>
      {loading && <p className="text-gray-500">Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id || item.id}
            className="flex justify-between items-center border px-3 py-2"
          >
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({item.quantity} {item.quantity > 1 ? "unidades" : "unidade"})
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {item.category}
              </span>
            </div>
            <button
              onClick={() => handleDeleteItem(item._id || item.id)}
              className="text-red-500 text-sm"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
