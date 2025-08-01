import logo from './images/logo.png';
<img src={logo} alt="Logo" />
import React from 'react';
import logo from './images/logo.png';

function App() {
  return (
    <div>
      <img src={logo} alt="Shop Logo" style={{ width: 120 }} />
      <h2>Vijayalakshmi Traders</h2>
      {/* ...rest of your code... */}
    </div>
  );
}

export default App;
