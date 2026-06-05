import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const containerStyle = {
  position: 'fixed', top: 70, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
};

const toastStyle = (type) => ({
  padding: '12px 20px', borderRadius: 8, fontSize: 15, fontFamily: '"IBM Plex Serif", serif',
  color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.25s ease',
  display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
  background: type === 'success' ? '#4a7a5a' : type === 'error' ? '#d35d5d' : '#3b2f2a',
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={toastStyle(t.type)}>
            {t.type === 'success' && '\u2713'} {t.type === 'error' && '\u2717'} {t.type === 'info' && '\u2139'}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}
