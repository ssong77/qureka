import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import Login from '../pages/Login';
import UploadPage from '../pages/UploadPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<UploadPage />} />
    </Routes>
  );
}

export default AppRouter;