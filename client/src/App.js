import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Login from "./views/Login";
import Home from "./views/Home";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
