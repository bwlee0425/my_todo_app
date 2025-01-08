import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://172.30.1.36:8000/api/todos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      setError('Todo 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      setError('할 일을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://172.30.1.36:8000/api/todos/',
        { title: newTodo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewTodo('');
      setError('');
      fetchTodos();
    } catch (error) {
      setError('할 일 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://172.30.1.36:8000/api/todos/${id}/`,
        { is_completed: completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTodos(); // 목록 새로고침
    } catch (error) {
      setError('할 일 상태 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://172.30.1.36:8000/api/todos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos(); // 목록 새로고침
    } catch (error) {
      setError('할 일 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    window.dispatchEvent(new Event('storage')); // storage 이벤트 트리거
    navigate('/login'); // 로그인 페이지로 리다이렉트
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="bg-black bg-opacity-70 p-6 rounded-xl shadow-2xl max-w-2xl mx-auto border-2 border-purple-500">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 neon-text">
          할 일 목록
        </h1>
        <form onSubmit={handleAddTodo} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="새로운 할 일"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium transition-all duration-200 shadow-lg"
            >
              추가
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                  className="w-4 h-4"
                />
                <span
                  className={todo.is_completed ? 'line-through text-gray-400' : 'text-white'}
                >
                  {todo.title}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium transition-all duration-200 shadow-lg"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default TodoPage;