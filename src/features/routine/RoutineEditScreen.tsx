import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, Save, Clock, RotateCcw } from 'lucide-react';
import { useData } from '../../hooks/useData';

export const RoutineEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, addTask, deleteTask, updateTask } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRepeat, setNewRepeat] = useState(false);

  const handleAdd = () => {
    if (newTask.trim()) {
      addTask(newTask, newTime || undefined, newRepeat);
      setNewTask('');
      setNewTime('');
      setNewRepeat(false);
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <button
        onClick={() => navigate('/routine')}
        className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] self-start mb-12 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Editar Rotina</h1>
          <p className="text-xl text-[#6B7280]">Gerencie suas atividades diárias.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-4 rounded-2xl bg-[#4A90E2] text-white shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white rounded-3xl shadow-md border-2 border-[#4A90E2] space-y-4"
          >
            <input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nome da atividade..."
              className="w-full text-xl font-medium outline-none"
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-[#6B7280]" />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setNewRepeat(!newRepeat)}
                className={`flex items-center space-x-2 p-2 rounded-xl transition-colors ${newRepeat ? 'bg-[#4A90E2]10 text-[#4A90E2]' : 'bg-gray-100 text-[#6B7280]'}`}
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">Repetir</span>
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-[#4A90E2] text-white rounded-xl font-medium"
            >
              Salvar Atividade
            </button>
          </motion.div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-6 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {task.time && <span className="text-[#4A90E2] font-bold">{task.time}</span>}
                {task.repeat && <RotateCcw className="w-4 h-4 text-[#6B7280]" />}
              </div>
              <h2 className="text-xl font-medium text-[#1F2937]">{task.task}</h2>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-3 text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
