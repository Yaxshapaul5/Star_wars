// Alert.tsx
import React from 'react';
import './style.css';

interface AlertProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const Alert: React.FC<AlertProps> = ({ 
  title, 
  description, 
  variant = 'default' 
}) => {
  return (
    <div className={`alert ${variant}`}>
      <h2 className="alert-title">{title}</h2>
      <p className="alert-description">{description}</p>
    </div>
  );
};