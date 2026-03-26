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

  const renderSection = (status: Task['status'], title: string) => {
    const sectionTasks = tasks.filter(t => t.status === status);
    if (sectionTasks.length === 0 && status !== 'DEPOIS') return null;

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#7F8C8D] px-2">
          {title} ({sectionTasks.length})
        </h3>
        <div className="space-y-3">
          {sectionTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleStatus(task.id)}
              className="w-full bg-white p-5 rounded-[24px] card-shadow flex items-center space-x-4 text-left active:scale-[0.99] transition-all border border-transparent hover:border-[#EBF0F5] group"
            >
              <div className="flex-shrink-0">
                {task.status === 'CONCLUÍDO' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#82E0AA]" />
                ) : task.status === 'AGORA' ? (
                  <Clock className="w-6 h-6 text-[#5DADE2]" />
                ) : (
                  <Circle className="w-6 h-6 text-[#BDC3C7]" />
                )}
              </div>
              <div className="flex-1">
                <span className={`text-lg font-medium ${task.status === 'CONCLUÍDO' ? 'text-[#BDC3C7] line-through' : 'text-[#2C3E50]'}`}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={(e) => deleteTask(task.id, e)}
                className="p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {status === 'DEPOIS' && sectionTasks.length === 0 && (
            <p className="text-center py-8 text-[#7F8C8D] italic">Nenhuma tarefa pendente.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout title="Rotina" onBack={() => navigate('/')}>
      <div className="space-y-10 py-4 pb-32">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Meu Dia</h2>
          <p className="text-[#7F8C8D]">Organize suas atividades com calma.</p>
        </div>

        <div className="space-y-10">
          {renderSection('AGORA', 'Fazendo agora')}
          {renderSection('DEPOIS', 'Próximas tarefas')}
          {renderSection('CONCLUÍDO', 'Concluídas')}
        </div>

        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto">
          <div className="bg-white p-3 rounded-[32px] card-shadow flex items-center space-x-3 border border-gray-100">
            <input 
              className="flex-1 px-4 py-2 outline-none text-lg text-[#2C3E50]"
              placeholder="Nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="p-4 rounded-[24px] text-white active:scale-90 transition-transform shadow-lg shadow-[#5DADE230]"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
