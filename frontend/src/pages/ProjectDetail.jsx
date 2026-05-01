import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

const statusColors = {
  TODO: { bg: '#1e293b', color: '#94a3b8', label: 'Todo' },
  IN_PROGRESS: { bg: '#1c1a00', color: '#f59e0b', label: 'In Progress' },
  DONE: { bg: '#052e16', color: '#10b981', label: 'Done' }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/tasks?projectId=${id}`)
      .then(res => { setTasks(res.data); setLoading(false); });
  }, [id]);

  const createTask = async () => {
    if (!title.trim()) { setError('Please enter a task title'); return; }
    try {
      const res = await api.post('/api/tasks', { title, projectId: id, dueDate: dueDate || null });
      setTasks([...tasks, res.data]);
      setTitle(''); setDueDate(''); setError('');
    } catch {
      setError('Failed to create task.');
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}`, { status });
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
    } catch { console.error('Failed to update'); }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch { console.error('Failed to delete'); }
  };

  const isOverdue = (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f13' }}>
      {/* Navbar */}
      <div style={{
        background: '#16162a', borderBottom: '1px solid #2d2d4e',
        padding: '0 32px', display: 'flex', alignItems: 'center', height: 64, gap: 16
      }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: '#ffffff11', border: '1px solid #2d2d4e', borderRadius: 8,
          color: '#9ca3af', padding: '6px 14px', cursor: 'pointer', fontSize: 13
        }}>← Back</button>
        <div style={{ width: 1, height: 24, background: '#2d2d4e' }} />
        <span style={{ fontWeight: 600, color: '#fff', fontSize: 16 }}>Project Tasks</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Add Task */}
        {user?.role === 'ADMIN' && (
          <div style={{
            background: '#16162a', border: '1px solid #2d2d4e',
            borderRadius: 16, padding: 20, marginBottom: 32
          }}>
            <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: 16, fontSize: 16 }}>Add New Task</h3>
            {error && (
              <div style={{
                background: '#2d1515', border: '1px solid #ef4444', borderRadius: 8,
                padding: '8px 12px', marginBottom: 12, color: '#ef4444', fontSize: 13
              }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                placeholder="Task title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createTask()}
                style={{
                  flex: 2, minWidth: 200, padding: '10px 16px', background: '#0f0f1a',
                  border: '1px solid #2d2d4e', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none'
                }}
              />
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  flex: 1, minWidth: 140, padding: '10px 16px', background: '#0f0f1a',
                  border: '1px solid #2d2d4e', borderRadius: 10, color: '#9ca3af', fontSize: 14, outline: 'none'
                }}
              />
              <button onClick={createTask} style={{
                padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>+ Add Task</button>
            </div>
          </div>
        )}

        {/* Task List */}
        <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: 16, fontSize: 18 }}>
          Tasks <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 14 }}>({tasks.length})</span>
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60, background: '#16162a',
            borderRadius: 16, border: '1px dashed #2d2d4e', color: '#6b7280'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                background: '#16162a', border: `1px solid ${isOverdue(t) ? '#ef444433' : '#2d2d4e'}`,
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      color: t.status === 'DONE' ? '#6b7280' : '#fff',
                      fontWeight: 500, fontSize: 15,
                      textDecoration: t.status === 'DONE' ? 'line-through' : 'none'
                    }}>{t.title}</span>
                    {isOverdue(t) && (
                      <span style={{
                        background: '#ef444422', border: '1px solid #ef444444',
                        color: '#ef4444', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500
                      }}>Overdue</span>
                    )}
                  </div>
                  {t.dueDate && (
                    <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    value={t.status}
                    onChange={e => updateStatus(t.id, e.target.value)}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      background: statusColors[t.status].bg,
                      color: statusColors[t.status].color,
                      border: `1px solid ${statusColors[t.status].color}44`,
                      cursor: 'pointer', outline: 'none'
                    }}>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  {user?.role === 'ADMIN' && (
                    <button onClick={() => deleteTask(t.id)} style={{
                      background: '#ef444422', border: '1px solid #ef444444',
                      borderRadius: 8, color: '#ef4444', padding: '6px 10px',
                      cursor: 'pointer', fontSize: 13
                    }}>🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}