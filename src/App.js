import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import './App.css';
import { useGoogleAuth } from './GoogleAuth';


function App() {

  const { isSignedIn } = useGoogleAuth();
  return (
    <div className="App">
      {isSignedIn ? <HomePage /> : <LoginPage/>}
    </div>
  );
}

export default App;
