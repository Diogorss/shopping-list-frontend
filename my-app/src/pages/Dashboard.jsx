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
  
  // Estados para edição
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("outros");

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

  // Função para iniciar a edição
  const handleStartEdit = (item) => {
    setEditingItem(item._id || item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity || 1);
    setEditCategory(item.category || "outros");
  };

  
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editingItem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          quantity: editQuantity,
          category: editCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar item");
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingItem(null);
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
            className="border px-3 py-2"
          >
            {editingItem === (item._id || item.id) ? (
              // Modo de edição
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className="w-20 border px-2 py-1"
                    min="1"
                  />
                </div>
                <div className="flex space-x-2">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="flex-1 border px-2 py-1"
                  >
                    <option value="alimentos">Alimentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="limpeza">Limpeza</option>
                    <option value="higiene">Higiene</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 text-sm px-2 py-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white text-sm px-2 py-1"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({item.quantity || 1} {(item.quantity || 1) > 1 ? "unidades" : "unidade"})
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {item.category || "outros"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-blue-500 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id || item.id)}
                    className="text-red-500 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
