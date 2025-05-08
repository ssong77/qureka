import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import Login from '../pages/Login';
import UploadPage from '../pages/UploadPage';
import QuestionCreatePage from '../pages/QuestionCreatePage';
import Mypage from '../pages/Mypage';
import SignupPage from '../pages/SignupPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/question-create" element={<QuestionCreatePage />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/signup" element={<SignupPage />} />

  
    </Routes>
  );
}

export default AppRouter;