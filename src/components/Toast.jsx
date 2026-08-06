import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-gray-900 text-white border-emerald-500',
    error: 'bg-red-600 text-white border-red-400',
    warning: 'bg-amber-600 text-white border-amber-400',
    info: 'bg-gray-900 text-white border-blue-500'
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-200" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-200" />,
    info: <Info className="w-4 h-4 text-blue-400" />
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <span className="font-extrabold text-xs tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};
