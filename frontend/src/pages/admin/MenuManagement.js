import React, { useState, useEffect } from 'react';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    ingredients: '',
    nutritionalInfo: '',
    imageUrl: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    price: '',
    available: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? "/api/admin/menu/" + editingId : '/api/admin/menu';
      const body = {
        ...form,
        price: parseFloat(form.price),
        ingredients: form.ingredients.split(',').map(i => i.trim()),
      };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(editingId ? 'Menu item updated' : 'Menu item added');
        setForm({
          name: '',
          category: '',
          description: '',
          ingredients: '',
          nutritionalInfo: '',
          imageUrl: '',
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false,
          price: '',
          available: true,
        });
        setEditingId(null);
        fetchMenuItems();
      } else {
        setMessage(data.message || 'Failed to save menu item');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      ingredients: item.ingredients.join(', '),
      nutritionalInfo: item.nutritionalInfo,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isSpicy: item.isSpicy,
      price: item.price.toString(),
      available: item.available,
    });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/admin/menu/" + id, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Menu item deleted');
        fetchMenuItems();
      } else {
        setMessage(data.message || 'Failed to delete menu item');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Menu Management</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="Snacks">Snacks</option>
            <option value="Main Course">Main Course</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Ingredients (comma separated)</label>
          <input
            type="text"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Nutritional Info</label>
          <input
            type="text"
            name="nutritionalInfo"
            value={form.nutritionalInfo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex space-x-4">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={form.isVegetarian}
              onChange={handleChange}
            />
            <span>Vegetarian</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="isVegan"
              checked={form.isVegan}
              onChange={handleChange}
            />
            <span>Vegan</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="isGlutenFree"
              checked={form.isGlutenFree}
              onChange={handleChange}
            />
            <span>Gluten-Free</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="isSpicy"
              checked={form.isSpicy}
              onChange={handleChange}
            />
            <span>Spicy</span>
          </label>
        </div>
        <div>
          <label className="block font-semibold mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Item' : 'Add Item'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Menu Items</h2>
      {menuItems.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <div className="space-y-4">
          {menuItems.map(item => (
            <div key={item._id} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
