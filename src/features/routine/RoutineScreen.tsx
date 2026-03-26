import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Task } from '../../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../lib/storage';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Tomar café', status: 'AGORA' },
  { id: '2', title: 'Escovar dentes', status: 'AGORA' },
  { id: '3', title: 'Trabalho / Estudo', status: 'DEPOIS' },
  { id: '4', title: 'Almoço', status: 'DEPOIS' },
];

export default function RoutineScreen() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const saved = loadFromStorage(STORAGE_KEYS.TASKS);
    if (saved) {
      setTasks(saved);
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveToStorage(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'AGORA'
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const sections: Task['status'][] = ['AGORA', 'DEPOIS', 'CONCLUÍDO'];

  return (
    <Layout title="Rotina" onBack={() => navigate('/')}>
      <div className="space-y-8 py-4">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm">
          <input 
            className="flex-1 p-4 outline-none text-lg"
            placeholder="Nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            className="px-6 bg-gray-800 text-white rounded-xl font-bold active:opacity-90"
          >
            Adicionar
          </button>
        </div>

        {sections.map(section => (
          <div key={section} className="space-y-3">
            <h3 className={`text-xs font-bold tracking-widest uppercase px-2 ${section === 'AGORA' ? 'text-red-500' : section === 'DEPOIS' ? 'text-orange-500' : 'text-green-600'}`}>
              {section}
            </h3>
            <div className="space-y-2">
              {tasks.filter(t => t.status === section).map(task => (
                <div key={task.id} className="bg-white p-5 rounded-2xl border-2 border-gray-100 flex items-center justify-between shadow-sm">
                  <span className={`text-lg font-medium flex-1 pr-4 ${section === 'CONCLUÍDO' ? 'line-through text-gray-300' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                  <div className="flex space-x-2">
                    {section !== 'CONCLUÍDO' ? (
                      <button 
                        onClick={() => moveTask(task.id, section === 'AGORA' ? 'DEPOIS' : 'CONCLUÍDO')} 
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold active:bg-gray-200"
                      >
                        {section === 'AGORA' ? 'Depois' : 'Pronto'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => moveTask(task.id, 'AGORA')} 
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold active:bg-gray-200"
                      >
                        Refazer
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Excluir"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === section).length === 0 && (
                <p className="text-xs text-gray-400 italic py-2 px-2">Nenhuma tarefa aqui</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
