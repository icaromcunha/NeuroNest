import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Task } from '../../types';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Tomar café', status: 'AGORA' },
  { id: '2', title: 'Escovar dentes', status: 'AGORA' },
  { id: '3', title: 'Trabalho / Estudo', status: 'DEPOIS' },
  { id: '4', title: 'Almoço', status: 'DEPOIS' },
];

export default function RoutineScreen() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'AGORA'
    };
    setTasks([...tasks, newTask]);
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
        <div className="flex space-x-2">
          <input 
            className="flex-1 p-4 border-2 border-gray-200 rounded-2xl"
            placeholder="Nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            className="px-6 bg-gray-800 text-white rounded-2xl font-bold"
          >
            +
          </button>
        </div>

        {sections.map(section => (
          <div key={section} className="space-y-3">
            <h3 className={`text-sm font-bold tracking-widest uppercase ${section === 'AGORA' ? 'text-red-500' : section === 'DEPOIS' ? 'text-orange-500' : 'text-green-500'}`}>
              {section}
            </h3>
            <div className="space-y-2">
              {tasks.filter(t => t.status === section).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between shadow-sm">
                  <span className={`text-lg font-medium ${section === 'CONCLUÍDO' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                  <div className="flex space-x-1">
                    {section !== 'AGORA' && (
                      <button onClick={() => moveTask(task.id, 'AGORA')} className="p-2 bg-gray-50 rounded-lg text-xs">⬆️</button>
                    )}
                    {section !== 'DEPOIS' && section !== 'CONCLUÍDO' && (
                      <button onClick={() => moveTask(task.id, 'DEPOIS')} className="p-2 bg-gray-50 rounded-lg text-xs">⬇️</button>
                    )}
                    {section !== 'CONCLUÍDO' && (
                      <button onClick={() => moveTask(task.id, 'CONCLUÍDO')} className="p-2 bg-green-50 rounded-lg text-xs">✅</button>
                    )}
                    <button onClick={() => deleteTask(task.id)} className="p-2 bg-red-50 rounded-lg text-xs">🗑️</button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === section).length === 0 && (
                <p className="text-xs text-gray-400 italic py-2">Nenhuma tarefa aqui</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
