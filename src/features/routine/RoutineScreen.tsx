import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Task } from '../../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Tomar café da manhã', status: 'DEPOIS' },
  { id: '2', title: 'Escovar os dentes', status: 'DEPOIS' },
  { id: '3', title: 'Trabalho / Estudo', status: 'DEPOIS' },
  { id: '4', title: 'Almoço', status: 'DEPOIS' },
];

export default function RoutineScreen() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const saved = loadFromStorage(STORAGE_KEYS.TASKS);
    if (saved && Array.isArray(saved)) {
      setTasks(saved);
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'DEPOIS'
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      let nextStatus: Task['status'] = 'DEPOIS';
      if (t.status === 'DEPOIS') nextStatus = 'AGORA';
      else if (t.status === 'AGORA') nextStatus = 'CONCLUÍDO';
      else nextStatus = 'DEPOIS';
      return { ...t, status: nextStatus };
    }));
  };

  return (
    <Layout title="Meu dia" onBack={() => navigate('/')}>
      <div className="space-y-10 py-4 pb-32">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-[#1F2937]">Meu Dia</h2>
          <p className="text-sm text-[#6B7280]">Organize suas atividades com calma.</p>
        </div>

        <div className="relative space-y-6">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100" />

          {tasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => toggleStatus(task.id)}
              className="relative flex items-center space-x-6 group"
            >
              <div className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white card-shadow border border-gray-50">
                {task.status === 'CONCLUÍDO' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#4A90E2]" />
                ) : task.status === 'AGORA' ? (
                  <div className="w-3 h-3 rounded-full bg-[#4A90E2]" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                )}
              </div>
              
              <div className={`flex-1 p-5 rounded-xl bg-white card-shadow border border-transparent flex items-center justify-between ${task.status === 'AGORA' ? 'border-[#4A90E2]10' : ''}`}>
                <div className="flex flex-col">
                  <span className={`text-base font-medium ${task.status === 'CONCLUÍDO' ? 'text-[#6B7280] line-through' : 'text-[#1F2937]'}`}>
                    {task.title}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mt-1">
                    {task.status === 'AGORA' ? 'Fazendo agora' : task.status === 'CONCLUÍDO' ? 'Concluído' : 'Próximo'}
                  </span>
                </div>
                
                <button 
                  onClick={(e) => deleteTask(task.id, e)}
                  className="p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-center py-12 text-[#6B7280] italic text-sm">Nenhuma tarefa na rotina.</p>
          )}
        </div>

        <div className="fixed bottom-24 left-6 right-6 max-w-md mx-auto">
          <div className="bg-white p-2 rounded-xl card-shadow flex items-center space-x-2 border border-gray-100">
            <input 
              className="flex-1 px-4 py-3 outline-none text-sm text-[#1F2937]"
              placeholder="Nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="p-3 rounded-lg text-white active:scale-90 transition-transform shadow-sm"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
