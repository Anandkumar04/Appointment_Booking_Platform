import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          confirmBg: 'bg-red-600 hover:bg-red-700',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          iconBg: 'bg-yellow-100'
        };
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-blue-600" />,
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              {styles.icon}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 ${styles.confirmBg} text-white rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;