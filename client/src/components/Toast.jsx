import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  if (!toasts || !toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle size={18} color="#39d353" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#f85149" />}
          {(!toast.type || toast.type === 'info') && <Info size={18} color="#58a6ff" />}
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'transparent', color: '#8b949e', marginLeft: 'auto', display: 'grid' }}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
