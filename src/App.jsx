import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    // storage 이벤트 리스너 추가
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={token ? <Navigate to="/todos" /> : <LoginPage />} />

        {/* 할 일 목록 페이지 */}
        <Route path="/todos" element={token ? <TodoPage /> : <Navigate to="/login" />} />

        {/* 기본 경로: 토큰 여부에 따라 리다이렉트 */}
        <Route
          path="/"
          element={token ? <Navigate to="/todos" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;