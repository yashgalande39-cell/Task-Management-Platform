import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const statusColors = { 'Backlog': '#64748b', 'Todo': '#3b82f6', 'In Progress': '#f59e0b', 'In Review': '#a855f7', 'Testing': '#06b6d4', 'Completed': '#22c55e', 'Blocked': '#ef4444' };

const Calendar = () => {
  const { tasks } = useAppStore();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const getTasksForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-black text-white">Calendar</h1>
        <p className="text-slate-400 mt-1">View all your tasks and deadlines</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 rounded-2xl p-6" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><ChevronLeft size={18}/></button>
              <button onClick={nextMonth} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`}/>;
              const dayTasks = getTasksForDay(day);
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
              const isSelected = day === selectedDay;
              return (
                <motion.div key={day} whileHover={{scale:1.05}} onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className="aspect-square flex flex-col items-center justify-start pt-2 rounded-xl cursor-pointer transition-all relative overflow-hidden p-1"
                  style={{background: isSelected ? 'rgba(var(--primary-rgb),0.3)' : isToday ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)', border: isSelected ? '1px solid rgba(var(--primary-rgb),0.6)' : isToday ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent'}}>
                  <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-400' : isSelected ? 'text-violet-300' : 'text-slate-300'}`}>{day}</span>
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {dayTasks.slice(0,3).map((t,ti) => (
                      <div key={ti} className="w-1.5 h-1.5 rounded-full" style={{background: statusColors[t.status]}}/>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="rounded-2xl p-6" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
          <h3 className="text-white font-bold mb-4">
            {selectedDay ? `${MONTHS[month]} ${selectedDay}, ${year}` : 'Select a day'}
          </h3>
          {!selectedDay ? (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">Upcoming deadlines</p>
              {tasks.filter(t => t.dueDate).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).slice(0,6).map(task => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.04)'}}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:statusColors[task.status]}}/>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedTasks.length === 0 ? (
            <p className="text-slate-400 text-sm">No tasks due on this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl" style={{background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-light)'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{background:`${statusColors[task.status]}20`, color:statusColors[task.status]}}>{task.status}</span>
                  </div>
                  <p className="text-white text-sm font-semibold">{task.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{task.projectName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
