import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../layout/Sidebar';
import { useSelector } from 'react-redux';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from "../../lib/firebase";
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiCalendar, FiUser, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/EmptyState';
import { useFormatDate } from '../../hooks/useFormatDate';
import CustomDropdown from '../../components/CustomDropdown';
import { requestNotificationPermission, showNotification } from '../../utils/notifications';

const AddTodoModal = ({ isOpen, onClose, userInfo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Tahmina');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '' || !userInfo) return;

    try {
      const todosRef = ref(db, `users/${userInfo.uid}/todos`);
      await push(todosRef, {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        assignedTo,
        completed: false,
        createdAt: new Date().toISOString(),
      });

      showNotification('New To-do', {
        body: newTodoTitle.trim(),
        tag: newTodoDescription.trim(),
        icon: '/todo-icon.svg',
      });

      onClose();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewTodoTitle('');
      setNewTodoDescription('');
      setAssignedTo('Tahmina');
    }
  }, [isOpen]);

  const assigneeOptions = [
    { value: 'Tahmina', label: 'Tahmina' },
    { value: 'Ashrafee', label: 'Ashrafee' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl border border-gray-200 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <CustomDropdown
                  options={assigneeOptions}
                  selected={assignedTo}
                  onChange={(value) => setAssignedTo(value)}
                />
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
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!newTodoTitle.trim()}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <FiPlus className="mr-2" size={16} />
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState('Tahmina');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userInfo = useSelector((state) => state.userLogInfo.value);
  const notificationSettings = useSelector((state) => state.notifications.value);
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
    } else {
      setIsLoading(false);
      setTodos([]);
    }
  }, [userInfo]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!notificationSettings.enabled) {
      return;
    }

    const interval = setInterval(() => {
      const incompleteTahmina = todos.filter(todo => todo.assignedTo === 'Tahmina' && !todo.completed).length;
      const incompleteAshrafee = todos.filter(todo => todo.assignedTo === 'Ashrafee' && !todo.completed).length;

      if (incompleteTahmina > 0 || incompleteAshrafee > 0) {
        let body = '';
        if (incompleteTahmina > 0) {
          body += `Tahmina has ${incompleteTahmina} To-do. `;
        }
        if (incompleteAshrafee > 0) {
          body += `Ashrafee has ${incompleteAshrafee} To-do. `;
        }
        body += 'Please complete your to-do.';

        showNotification('Rentiva - TODO Reminder', {
          body: body,
          icon: '/todo-icon.svg',
        });
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [todos, notificationSettings.enabled]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  const handleToggleComplete = async (todo) => {
    if (!userInfo) return;
    try {
      const todoRef = ref(db, `users/${userInfo.uid}/todos/${todo.id}`);
      await update(todoRef, { completed: !todo.completed });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!userInfo) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
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
        aria-label={todo.completed ? 'Mark as not completed' : 'Mark as completed'}
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
        aria-label={`Delete task: ${todo.title}`}
      >
        <FiTrash2 size={16} />
      </button>
    </motion.div>
  );

  const UserTab = ({ name, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full justify-center ${
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

  const renderTodoList = (name, todos) => (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{name}'s Tasks</h2>
        {todos.length > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
            {todos.length}
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : todos.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {todos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState 
          title={`No tasks for ${name}`}
          description="All caught up!" 
          className="py-8"
        />
      )}
    </div>
  );

  return (
    <Sidebar>
      <div className="relative">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Todo List</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Manage tasks for you and your team
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors mt-4 sm:mt-0"
            >
              <FiPlus className="mr-2" size={16} />
              Add Task
            </button>
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
              {renderTodoList("Tahmina", tahminaTodos)}
              {renderTodoList("Ashrafee", ashrafeeTodos)}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {activeTab === 'Tahmina' 
                ? renderTodoList("Tahmina", tahminaTodos)
                : renderTodoList("Ashrafee", ashrafeeTodos)
              }
            </div>
          </div>
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 z-40"
          aria-label="Add new task"
        >
          <FiPlus size={24} />
        </button>

        <AddTodoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userInfo={userInfo}
        />
      </div>
    </Sidebar>
  );
};

export default Todo;