import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DataAlumni from './pages/DataAlumni';
import Tentang from './pages/Tentang';
import Kegiatan from './pages/Kegiatan';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/data-alumni" element={<DataAlumni />} />
      <Route path="/tentang" element={<Tentang />} />
      <Route path="/kegiatan" element={<Kegiatan />} />
    </Routes>
  </Router>
);

export default App;
