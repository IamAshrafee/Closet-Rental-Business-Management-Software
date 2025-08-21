import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../layout/Sidebar';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, push, set, update, remove } from 'firebase/database';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';

import { useFormatDate } from '../hooks/useFormatDate';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Tahmina'); // Default assignment
  const [isLoading, setIsLoading] = useState(true);

  const db = getDatabase();
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
  }, [db, userInfo]);

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
    todos.filter(todo => todo.assignedTo === 'Tahmina').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [todos]
  );

  const ashrafeeTodos = useMemo(() => 
    todos.filter(todo => todo.assignedTo === 'Ashrafee').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [todos]
  );

  const TodoItem = ({ todo }) => (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-grow mr-4">
          <button 
            onClick={() => handleToggleComplete(todo)}
            className="flex-shrink-0 mr-3 text-gray-400 hover:text-indigo-600"
          >
            {todo.completed ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
          </button>
          <div className="flex flex-col">
            <span className={`text-gray-800 font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
            {todo.description && (
              <span className={`text-sm text-gray-600 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.description}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => handleDeleteTodo(todo.id)}
          className="flex-shrink-0 text-red-500 hover:text-red-700"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
      <div className="flex items-center text-xs text-gray-500 mt-1">
        <FiCalendar className="mr-1" size={12} />
        <span>Added: {formatDateTime(todo.createdAt)}</span>
      </div>
    </motion.li>
  );

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Todo List</h1>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label htmlFor="newTodoTitle" className="sr-only">Todo Title</label>
            <input
              type="text"
              id="newTodoTitle"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Todo Title..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="newTodoDescription" className="sr-only">Description</label>
            <input
              type="text"
              id="newTodoDescription"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="assignedTo" className="sr-only">Assign to</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Tahmina">Tahmina</option>
              <option value="Ashrafee">Ashrafee</option>
            </select>
            <button
              type="submit"
              className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Add Todo
            </button>
          </div>
        </form>

        {/* Todo Lists - Desktop View (Side-by-side) */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 flex-grow">
          <div className="flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tahmina's Todos</h2>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>)}
              </div>
            ) : tahminaTodos.length > 0 ? (
              <ul className="space-y-2">
                <AnimatePresence>
                  {tahminaTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <EmptyState title="No todos for Tahmina" description="Time to relax!" className="flex-grow flex items-center justify-center" />
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ashrafee's Todos</h2>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>)}
              </div>
            ) : ashrafeeTodos.length > 0 ? (
              <ul className="space-y-2">
                <AnimatePresence>
                  {ashrafeeTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <EmptyState title="No todos for Ashrafee" description="All clear!" className="flex-grow flex items-center justify-center" />
            )}
          </div>
        </div>

        {/* Todo Lists - Mobile View (Tabs) */}
        <div className="md:hidden flex flex-col flex-grow">
          <div role="tablist" className="flex border-b border-gray-200 mb-4">
            <button
              role="tab"
              aria-selected={assignedTo === 'Tahmina'}
              className={`flex-1 px-4 py-2 text-sm font-medium ${assignedTo === 'Tahmina' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setAssignedTo('Tahmina')}
            >
              Tahmina
            </button>
            <button
              role="tab"
              aria-selected={assignedTo === 'Ashrafee'}
              className={`flex-1 px-4 py-2 text-sm font-medium ${assignedTo === 'Ashrafee' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setAssignedTo('Ashrafee')}
            >
              Ashrafee
            </button>
          </div>

          <div className="flex-grow">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>)}
              </div>
            ) : assignedTo === 'Tahmina' ? (
              tahminaTodos.length > 0 ? (
                <ul className="space-y-2">
                  <AnimatePresence>
                    {tahminaTodos.map(todo => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <EmptyState title="No todos for Tahmina" description="Time to relax!" className="flex-grow flex items-center justify-center" />
              )
            ) : (
              ashrafeeTodos.length > 0 ? (
                <ul className="space-y-2">
                  <AnimatePresence>
                    {ashrafeeTodos.map(todo => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <EmptyState title="No todos for Ashrafee" description="All clear!" className="flex-grow flex items-center justify-center" />
              )
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Todo;