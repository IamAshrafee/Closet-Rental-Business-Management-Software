import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../layout/Sidebar';
import { useSelector } from 'react-redux';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../authentication/firebaseConfig';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiCalendar, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useFormatDate } from '../hooks/useFormatDate';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Tahmina');
  const [activeTab, setActiveTab] = useState('Tahmina');
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector((state) => state.userLogInfo.value);
  const { formatDate, formatTime } = useFormatDate();

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const todosRef = ref(db, `users/${userInfo.uid}/todos`);
      const unsubscribe = onValue(todosRef, (snapshot) => {
        const data = snapshot.val() || {};
        const todosList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setTodos(todosList);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [userInfo]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') return;

    try {
      const todosRef = ref(db, `users/${userInfo.uid}/todos`);
      await push(todosRef, {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        assignedTo,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      setNewTodoTitle('');
      setNewTodoDescription('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const todoRef = ref(db, `users/${userInfo.uid}/todos/${todo.id}`);
      await update(todoRef, { completed: !todo.completed });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        const todoRef = ref(db, `users/${userInfo.uid}/todos/${todoId}`);
        await remove(todoRef);
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const tahminaTodos = useMemo(() => 
    todos.filter(todo => todo.assignedTo === 'Tahmina')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [todos]
  );

  const ashrafeeTodos = useMemo(() => 
    todos.filter(todo => todo.assignedTo === 'Ashrafee')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [todos]
  );

  const TodoItem = ({ todo }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-4 rounded-lg border border-gray-200 flex items-start space-x-3"
    >
      <button 
        onClick={() => handleToggleComplete(todo)}
        className={`flex-shrink-0 mt-0.5 ${todo.completed ? 'text-emerald-500' : 'text-gray-400 hover:text-indigo-600'}`}
      >
        {todo.completed ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`text-xs text-gray-600 mt-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.description}
          </p>
        )}
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <FiCalendar size={12} className="mr-1" />
          <span>Added: {formatDateTime(todo.createdAt)}</span>
        </div>
      </div>
      
      <button 
        onClick={() => handleDeleteTodo(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <FiTrash2 size={16} />
      </button>
    </motion.div>
  );

  const UserTab = ({ name, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      <FiUser size={14} className="mr-2" />
      {name}
      {count > 0 && (
        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
          isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-800'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <Sidebar>
      <div className="flex flex-col px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Todo List</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Manage tasks for you and your team
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newTodoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  id="newTodoTitle"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Tahmina">Tahmina</option>
                  <option value="Ashrafee">Ashrafee</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="newTodoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                id="newTodoDescription"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                placeholder="Add details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={!newTodoTitle.trim()}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <FiPlus className="mr-2" size={16} />
              Add Task
            </button>
          </form>
        </div>

        {/* Todo Lists */}
        <div className="space-y-5 md:space-y-6">
          {/* Mobile Tabs */}
          <div className="md:hidden flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <UserTab 
              name="Tahmina" 
              count={tahminaTodos.length} 
              isActive={activeTab === 'Tahmina'} 
              onClick={() => setActiveTab('Tahmina')} 
            />
            <UserTab 
              name="Ashrafee" 
              count={ashrafeeTodos.length} 
              isActive={activeTab === 'Ashrafee'} 
              onClick={() => setActiveTab('Ashrafee')} 
            />
          </div>

          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-2 gap-5 lg:gap-6">
            {/* Tahmina's Todos */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tahmina's Tasks</h2>
                {tahminaTodos.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {tahminaTodos.length}
                  </span>
                )}
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : tahminaTodos.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {tahminaTodos.map(todo => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState 
                  title="No tasks for Tahmina" 
                  description="All caught up! Time to relax." 
                  className="py-8"
                />
              )}
            </div>

            {/* Ashrafee's Todos */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Ashrafee's Tasks</h2>
                {ashrafeeTodos.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {ashrafeeTodos.length}
                  </span>
                )}
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : ashrafeeTodos.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {ashrafeeTodos.map(todo => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState 
                  title="No tasks for Ashrafee" 
                  description="Everything is completed!" 
                  className="py-8"
                />
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {activeTab === 'Tahmina' ? (
              <div>
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tahmina's Tasks</h2>
                  {tahminaTodos.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {tahminaTodos.length}
                    </span>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : tahminaTodos.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {tahminaTodos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <EmptyState 
                    title="No tasks for Tahmina" 
                    description="All caught up! Time to relax." 
                    className="py-8"
                  />
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Ashrafee's Tasks</h2>
                  {ashrafeeTodos.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {ashrafeeTodos.length}
                    </span>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : ashrafeeTodos.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {ashrafeeTodos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <EmptyState 
                    title="No tasks for Ashrafee" 
                    description="Everything is completed!" 
                    className="py-8"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Todo;
