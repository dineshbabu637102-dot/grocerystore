import React, { useState } from 'react';
import './App.css';



const PRODUCTS = [
  { id: 1,  name: 'Milk (1 litre)',         price: 50 },
  { id: 2,  name: 'Bread',                  price: 30 },
  { id: 3,  name: 'Eggs (Dozen)',           price: 60 }, // use typical price
  { id: 4,  name: 'Rice (1kg)',             price: 80 },
  { id: 5,  name: 'Apples (1kg)',           price: 120 },
  { id: 6,  name: 'Milk (Half litre)',      price: 30 }, // assuming 10 was a typo
  { id: 7,  name: 'Milk Biscuit',           price: 30 },
  { id: 8,  name: 'Surf Detergent (1kg)',   price: 35 },
  { id: 9,  name: '3 Roses Tea Dust',       price: 45 },
  { id: 10, name: 'BRU Instant Coffee',     price: 10 },
  { id: 11, name: 'Dal',                    price: 120 },
];


function App() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [customer, setCustomer] = useState(null); // null if not logged in
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Payment related states
  const [isCheckout, setIsCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Minimal login validation (for demo, password is just 'password')
  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput.trim() === '') {
      alert('Please enter username');
      return;
    }
    if (passwordInput !== 'password') {
      alert('Incorrect password (hint: use "password")');
      return;
    }
    setCustomer({ username: usernameInput.trim() });
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleLogout = () => {
    setCustomer(null);
    setCart([]);
    setQuantities({});
    setIsCheckout(false);
    setPaymentSuccess(false);
    setPaymentError('');
  };

  const handleQuantityChange = (id, value) => {
    const val = Math.max(1, Number(value)); // minimum quantity 1
    setQuantities((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart[index].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty! Please add some products.');
      return;
    }
    setIsCheckout(true);
    setPaymentSuccess(false);
    setPaymentError('');
    setPaymentAmount('');
    setPaymentMethod('cash');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const total = getTotal();

    // Simple validation: payment amount >= total
    if (Number(paymentAmount) < total) {
      setPaymentError(`Payment amount should be at least ₹${total}`);
      setPaymentSuccess(false);
      return;
    }

    setPaymentError('');
    setPaymentSuccess(true);

    // Optionally clear cart and checkout state after successful payment
    setCart([]);
    setQuantities({});
    setIsCheckout(false);
  };

  // Render login form if user not logged in
  if (!customer) {
    return (
      <div className="container">
        <h2>Vijayalakshmi Traders - Customer Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label>
              Username:{' '}
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:{' '}
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
    );
  }

  // If logged in, render billing app and conditionally checkout
  return (
    <div className="container">
      <h2>Vijayalakshmi Traders</h2>
      <p>
        Welcome, <strong>{customer.username}</strong>!{' '}
        <button
          className="button"
          style={{ background: '#e67e22' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </p>

      {!isCheckout ? (
        <>
          <div>
            <h3>Products</h3>
            {PRODUCTS.map((product) => (
              <div className="product" key={product.id}>
                <span>
                  {product.name} - ₹{product.price}
                </span>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                />
                <button className="button" onClick={() => addToCart(product)}>
                  Add
                </button>
              </div>
            ))}
          </div>

          <div className="cart">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              cart.map((item) => (
                <div className="product" key={item.id}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                  <button
                    className="button"
                    style={{ background: '#c0392b' }}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
            <hr />
            <h3>Total: ₹{getTotal()}</h3>
            <button className="button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="checkout-section">
          <h3>Checkout & Payment</h3>
          <p>Total Amount: ₹{getTotal()}</p>
          <form onSubmit={handlePaymentSubmit}>
            <div>
              <label>
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  
                </select>
              </label>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>
                Amount Paid: ₹
                <input
                  type="number"
                  min={getTotal()}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </label>
            </div>

            {paymentError && (
              <p style={{ color: 'red', marginTop: '10px' }}>{paymentError}</p>
            )}

            <button type="submit" className="button" style={{ marginTop: '15px' }}>
              Pay Now
            </button>
            <button
              type="button"
              className="button"
              style={{ marginLeft: '10px', backgroundColor: '#7f8c8d' }}
              onClick={() => setIsCheckout(false)}
            >
              Cancel
            </button>
          </form>
          {paymentSuccess && (
            <p style={{ color: 'green', marginTop: '15px' }}>
              Payment successful! Thank you for shopping.
            </p>
          )}
        </div>
      )}
    </div>
  );
}



export default App;
