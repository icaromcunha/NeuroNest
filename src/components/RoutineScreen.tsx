import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListTodo, Plus, Trash2, ChevronLeft, Check, Circle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RoutineScreenProps {
  onBack: () => void;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({ onBack }) => {
  const { tasks, setTasks } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), title: newTaskTitle, completed: false }]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="p-6 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Rotina</h1>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-3 rounded-2xl ${isAdding ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'} active:scale-90 transition-transform`}
        >
          {isAdding ? <Check size={24} /> : <Plus size={24} />}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm border border-gray-100"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center space-x-4 flex-1 text-left"
                >
                  <div className={`transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300'}`}>
                    {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </div>
                  <span className={`text-xl font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                </button>
                
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-2 text-gray-300 hover:text-red-400 active:scale-90 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-3xl shadow-lg border-2 border-blue-100 space-y-4"
            >
              <input
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="O que você precisa fazer?"
                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold active:scale-95 transition-transform"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold active:scale-95 transition-transform"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          )}

          {tasks.length === 0 && !isAdding && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mx-auto">
                <ListTodo size={40} />
              </div>
              <p className="text-gray-400 text-lg">Nenhuma tarefa pendente</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
