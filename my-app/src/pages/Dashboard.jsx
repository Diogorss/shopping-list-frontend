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

  
  const handleStartEdit = (item) => {
    setEditingItem(item._id || item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity || 1);
    setEditCategory(item.category || "outros");
  };

  // Função para salvar as alterações
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

  // Função para obter a cor de fundo baseada na categoria
  const getCategoryColor = (category) => {
    const colors = {
      alimentos: "bg-green-100 text-green-800",
      bebidas: "bg-blue-100 text-blue-800",
      limpeza: "bg-yellow-100 text-yellow-800",
      higiene: "bg-purple-100 text-purple-800",
      outros: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.outros;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Minha Lista de Compras</h2>
              <button 
                onClick={handleLogout} 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-all"
              >
                Sair
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Adicionar Novo Item</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome do item"
                  />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full sm:w-24 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                    placeholder="Qtd"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="alimentos">Alimentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="limpeza">Limpeza</option>
                    <option value="higiene">Higiene</option>
                    <option value="outros">Outros</option>
                  </select>
                  <button
                    onClick={handleAddItem}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md transition-all shadow-md"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
            
            {loading && (
              <div className="flex justify-center my-4">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
             )}
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {items.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Sua lista de compras está vazia. Adicione alguns itens!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item._id || item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    {editingItem === (item._id || item.id) ? (
                      // Modo de edição
                      <div className="p-4 bg-gray-50">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(Number(e.target.value))}
                              className="w-full sm:w-24 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              min="1"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="alimentos">Alimentos</option>
                              <option value="bebidas">Bebidas</option>
                              <option value="limpeza">Limpeza</option>
                              <option value="higiene">Higiene</option>
                              <option value="outros">Outros</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Modo de visualização
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-500">
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600 mr-2">
                                {item.quantity || 1} {(item.quantity || 1) > 1 ? "unidades" : "unidade"}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category || "outros")}`}>
                                {item.category || "outros"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={( ) => handleDeleteItem(item._id || item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Remover"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                     )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
