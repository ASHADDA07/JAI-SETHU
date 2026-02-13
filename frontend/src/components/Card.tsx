import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  action?: React.ReactNode;
}

export const Card = ({ children, title, className = '', action }: CardProps) => {
  return (
    // Changed: bg-white, text-black, light shadow
    <div className={`bg-white border border-gray-100 rounded-xl p-6 shadow-legal hover:shadow-legal-hover transition-all duration-300 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};