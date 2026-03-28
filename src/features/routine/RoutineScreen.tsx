import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Circle, Edit3 } from 'lucide-react';
import { useData } from '../../hooks/useData';

export const RoutineScreen: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, toggleTask } = useData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate('/routine/edit')}
          className="p-3 rounded-full bg-white shadow-sm text-[#4A90E2] active:scale-95 transition-transform"
        >
          <Edit3 className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-16">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Meu dia</h1>
        <p className="text-xl text-[#6B7280]">Veja o que vem agora.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-8 relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-[#E5E7EB] rounded-full" />

        {tasks.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-8 relative z-10"
          >
            <button
              onClick={() => toggleTask(item.id)}
              className={`p-2 rounded-full bg-white shadow-sm border-2 transition-colors ${item.completed ? 'border-[#4A90E2]' : 'border-[#E5E7EB]'}`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-8 h-8 text-[#4A90E2]" />
              ) : (
                <Circle className="w-8 h-8 text-[#E5E7EB]" />
              )}
            </button>
            <div className="flex-1 p-6 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
              <div className="text-left">
                {item.time && <span className="text-xl font-bold text-[#4A90E2]">{item.time}</span>}
                <h2 className={`text-2xl font-medium mt-1 ${item.completed ? 'text-[#6B7280] line-through' : 'text-[#1F2937]'}`}>
                  {item.task}
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
