import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import Login from '../pages/Login';
import UploadPage from '../pages/UploadPage';
import QuestionCreatePage from '../pages/QuestionCreatePage';
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/question-create" element={<QuestionCreatePage />} />
  
    </Routes>
  );
}

export default AppRouter;