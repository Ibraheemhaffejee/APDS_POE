// App.js
import React, { useContext, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';
import { AuthContext } from './contexts/AuthContext';
import './App.css';

const App = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interdepartmental Bulletin Board</h1>
      </header>

      {!isAuthenticated ? (
        <>
          {showLogin ? (
            <>
              <h2>Login</h2>
              <Login />
              <p>Don't have an account? <button onClick={handleToggle}>Register</button></p>
            </>
          ) : (
            <>
              <h2>Register</h2>
              <Register />
              <p>Already have an account? <button onClick={handleToggle}>Login</button></p>
            </>
          )}
        </>
      ) : (
        <>
          <section>
            <h2>Bulletin Board</h2>
            <Posts />
            <button onClick={logout}>Logout</button>
          </section>
        </>
      )}
    </div>
  );
};

export default App;
