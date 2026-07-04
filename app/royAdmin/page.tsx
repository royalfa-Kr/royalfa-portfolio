"use client";

import { useState, useEffect } from 'react';
import { saveAdminData, getAdminData, type ClassData } from './actions';
import { Lock, Save, Calendar, CheckCircle2 } from 'lucide-react';

export default function RoyAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [classData, setClassData] = useState<ClassData>({
    isActive: true,
    date: '',
    time: '',
    subject: '',
    topic: '',
    modality: 'En línea'
  });

  useEffect(() => {
    if (isAuthenticated) {
      getAdminData().then(data => setClassData(data));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().length > 0) setIsAuthenticated(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    const result = await saveAdminData(pin, classData);
    
    setStatus({ 
      type: result.success ? 'success' : 'error', 
      message: result.message 
    });
    
    if (!result.success) {
      setIsAuthenticated(false);
      setPin('');
    }
    
    setIsLoading(false);
    
    if (result.success) {
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-dark flex flex-col items-center justify-center p-6">
        <div className="bg-base-surface border border-base-border p-8 rounded-sm w-full max-w-sm text-center">
          <Lock className="text-accent-gold mx-auto mb-4" size={40} />
          <h1 className="text-2xl font-serif text-text-main mb-6">Acceso Restringido</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ingresa tu PIN" 
              className="w-full bg-base-dark border border-base-border text-center text-text-main py-3 rounded-sm focus:border-accent-gold outline-none tracking-[0.5em]"
            />
            <button type="submit" className="w-full bg-accent-gold hover:bg-accent-goldHover text-base-dark font-bold py-3 rounded-sm transition-colors">
              Entrar al Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 pb-24">
      <div className="max-w-xl mx-auto space-y-6">
        
        <header className="flex items-center gap-3 border-b border-base-border pb-4 mb-8">
          <div className="p-2 bg-accent-gold/10 border border-accent-gold/30 rounded-sm">
            <Calendar className="text-accent-gold" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-serif text-text-main">Centro de Mando</h1>
            <p className="text-xs text-text-muted">Actualización en tiempo real</p>
          </div>
        </header>

        <form onSubmit={handleSave} className="bg-base-surface border border-base-border p-5 rounded-sm space-y-4">
          <h2 className="text-accent-gold uppercase tracking-wider text-sm font-semibold mb-4 border-b border-base-border/50 pb-2">
            Próxima Clase
          </h2>

          <label className="flex items-center gap-3 p-3 border border-base-border bg-base-dark rounded-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={classData.isActive}
              onChange={(e) => setClassData({...classData, isActive: e.target.checked})}
              className="accent-accent-gold w-5 h-5"
            />
            <span className="text-text-main text-sm">Mostrar tarjeta en la página principal</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Fecha</label>
              <input 
                type="text" value={classData.date} onChange={(e) => setClassData({...classData, date: e.target.value})}
                placeholder="Ej. Lunes 6" className="w-full bg-base-dark border border-base-border p-3 text-sm text-text-main rounded-sm focus:border-accent-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Hora</label>
              <input 
                type="text" value={classData.time} onChange={(e) => setClassData({...classData, time: e.target.value})}
                placeholder="Ej. 12:00 PM" className="w-full bg-base-dark border border-base-border p-3 text-sm text-text-main rounded-sm focus:border-accent-gold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Materia</label>
              <input 
                type="text" value={classData.subject} onChange={(e) => setClassData({...classData, subject: e.target.value})}
                placeholder="Ej. Física" className="w-full bg-base-dark border border-base-border p-3 text-sm text-text-main rounded-sm focus:border-accent-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Modalidad</label>
              <select 
                value={classData.modality} onChange={(e) => setClassData({...classData, modality: e.target.value})}
                className="w-full bg-base-dark border border-base-border p-3 text-sm text-text-main rounded-sm focus:border-accent-gold outline-none"
              >
                <option value="En línea">En línea</option>
                <option value="En vivo">En vivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Tema</label>
            <input 
              type="text" value={classData.topic} onChange={(e) => setClassData({...classData, topic: e.target.value})}
              placeholder="Ej. Vectores y Cinemática" className="w-full bg-base-dark border border-base-border p-3 text-sm text-text-main rounded-sm focus:border-accent-gold outline-none"
            />
          </div>

          {status.message && (
            <div className={`p-3 text-sm rounded-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50' : 'bg-red-950/30 text-red-400 border border-red-900/50'}`}>
              {status.type === 'success' && <CheckCircle2 size={16} />}
              {status.message}
            </div>
          )}

          <button 
            type="submit" disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-accent-gold hover:bg-accent-goldHover text-base-dark font-bold py-3 mt-4 rounded-sm transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? 'Guardando...' : 'Guardar y Publicar'}
          </button>
        </form>
      </div>
    </div>
  );
}