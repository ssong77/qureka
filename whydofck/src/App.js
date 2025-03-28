import React from 'react';
import './App.css'; // 스타일을 정의할 CSS 파일을 연결합니다.

function App() {
  return (
    <div className="container">
      {/* 상단 네비게이션 */}
      <header className="header">
        <div className="logo">Logo</div>
        <button className="login-btn">로그인</button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h1 className="main-title">여러분들의 문서 도우미!</h1>
        <p className="sub-text">
          여러분들의 시험공부를 도와드립니다. 많은양의 문서자료를 요약,압축
        </p>

        {/* 버튼 */}
        <div className="buttons">
          <button className="join-btn">Join us now</button>
          <button className="demo-btn">Request demo</button>
        </div>

        {/* 이미지 */}
        <div className="image-container">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img 
            src="/path-to-image.png" 
            alt="설명 이미지" 
            className="main-image" 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
