import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/api/projects'),
      api.get('/api/tasks')
    ]).then(([p, t]) => {
      setProjects(p.data);
      setTasks(t.data);
      setLoading(false);
    });
  }, []);

  const createProject = async () => {
    if (!newProject.trim()) return;
    const res = await api.post('/api/projects', { name: newProject });
    setProjects([...projects, res.data]);
    setNewProject('');
  };

  const deleteProject = async (id) => {
    await api.delete(`/api/projects/${id}`);
    setProjects(projects.filter(p => p.id !== id));
  };

  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');
  const done = tasks.filter(t => t.status === 'DONE');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');

  const statCard = (label, value, color, icon) => (
    <div style={{
      flex: 1, background: '#16162a', border: `1px solid ${color}33`,
      borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
      <div style={{
        position: 'absolute', right: -10, top: -10, width: 80, height: 80,
        background: color, borderRadius: '50%', opacity: 0.05
      }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f13' }}>
      {/* Navbar */}
      <div style={{
        background: '#16162a', borderBottom: '1px solid #2d2d4e',
        padding: '0 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#4f46e522', border: '1px solid #4f46e544',
            borderRadius: 20, padding: '4px 12px', fontSize: 12,
            color: '#818cf8', fontWeight: 500
          }}>{user?.role}</div>
          <span style={{ color: '#9ca3af', fontSize: 14 }}>{user?.name}</span>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            padding: '7px 16px', background: '#ef444422', border: '1px solid #ef444444',
            borderRadius: 8, color: '#ef4444', fontSize: 13, cursor: 'pointer', fontWeight: 500
          }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Dashboard</h2>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>Welcome back, {user?.name}!</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          {statCard('Total Tasks', tasks.length, '#818cf8', '📋')}
          {statCard('In Progress', inProgress.length, '#f59e0b', '⚙️')}
          {statCard('Completed', done.length, '#10b981', '✅')}
          {statCard('Overdue', overdue.length, '#ef4444', '⚠️')}
        </div>

        {/* Projects */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Projects</h3>
          {user?.role === 'ADMIN' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="New project name..."
                value={newProject}
                onChange={e => setNewProject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProject()}
                style={{
                  padding: '9px 16px', background: '#16162a', border: '1px solid #2d2d4e',
                  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', width: 220
                }}
              />
              <button onClick={createProject} style={{
                padding: '9px 18px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: 'pointer'
              }}>+ Create</button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Loading...</div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60, background: '#16162a',
            borderRadius: 16, border: '1px dashed #2d2d4e', color: '#6b7280'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <p>No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {projects.map(p => (
              <div key={p.id} style={{
                background: '#16162a', border: '1px solid #2d2d4e', borderRadius: 16,
                padding: 20, cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d4e'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div onClick={() => navigate(`/project/${p.id}`)} style={{ flex: 1 }}>
                    <div style={{
                      width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e522, #7c3aed22)',
                      border: '1px solid #4f46e544', borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, marginBottom: 12
                    }}>📌</div>
                    <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{p.name}</h4>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>
                      {p.tasks?.length || 0} tasks
                    </p>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button onClick={() => deleteProject(p.id)} style={{
                      background: 'none', border: 'none', color: '#6b7280',
                      cursor: 'pointer', fontSize: 16, padding: 4
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