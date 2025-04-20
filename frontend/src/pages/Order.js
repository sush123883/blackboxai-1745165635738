import React, { useState, useEffect } from 'react';

function Order() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [message, setMessage] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  const handleAddItem = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find(i => i.menuItem._id === item._id);
      if (existing) {
        return prev.map(i =>
          i.menuItem._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { menuItem: item, quantity: 1, customizations: '', specialInstructions: '' }];
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter(i => i.menuItem._id !== itemId));
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    setSelectedItems((prev) =>
      prev.map(i =>
        i.menuItem._id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const handleCustomizationChange = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map(i =>
        i.menuItem._id === itemId ? { ...i, customizations: value } : i
      )
    );
  };

  const handleSpecialInstructionsChange = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map(i =>
        i.menuItem._id === itemId ? { ...i, specialInstructions: value } : i
      )
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage('Please select at least one item.');
      return;
    }
    setMessage('');
    setPaymentProcessing(true);
    const orderItems = selectedItems.map(i => ({
      menuItem: i.menuItem._id,
      quantity: i.quantity,
      customizations: i.customizations,
      specialInstructions: i.specialInstructions,
    }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          items: orderItems,
          totalPrice: calculateTotal(),
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Simulate payment processing
        const paymentResponse = await fetch('/api/payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            orderId: data.order._id,
            paymentMethod,
            paymentDetails: {}, // Add payment details as needed
          }),
        });
        const paymentData = await paymentResponse.json();
        if (paymentResponse.ok && paymentData.success) {
          setMessage('Order placed and payment processed successfully!');
          setSelectedItems([]);
          setSpecialInstructions('');
        } else {
          setMessage('Order placed but payment failed: ' + (paymentData.message || ''));
        }
      } else {
        setMessage(data.message || 'Failed to place order');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Place Your Order</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
              )}
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-auto font-bold">₹{item.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddItem(item)}
                className="mt-2 bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-2">Selected Items</h3>
        {selectedItems.length === 0 && <p>No items selected.</p>}
        {selectedItems.map(item => (
          <div key={item.menuItem._id} className="bg-white rounded shadow p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{item.menuItem.name}</h4>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.menuItem._id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-2">
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.menuItem._id, parseInt(e.target.value))}
                  className="ml-2 w-16 border border-gray-300 rounded px-2 py-1"
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-semibold">Customizations (e.g., extra toppings, spice level):</label>
              <input
                type="text"
                value={item.customizations}
                onChange={(e) => handleCustomizationChange(item.menuItem._id, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Special Instructions:</label>
              <input
                type="text"
                value={item.specialInstructions}
                onChange={(e) => handleSpecialInstructionsChange(item.menuItem._id, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Wallet (Paytm, Google Pay)</option>
          </select>
        </div>

        <div className="mb-6 font-bold text-lg">
          Total: ₹{calculateTotal().toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={paymentProcessing}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {paymentProcessing ? 'Processing Payment...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Order;
