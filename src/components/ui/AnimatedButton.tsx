import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  // Variantes de cores baseadas no tipo
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-purple-500 hover:bg-purple-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  };

  // Tamanhos baseados na classe
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  return (
    <motion.button
      className={`
        rounded-full font-bold flex items-center justify-center
        transition-colors duration-300
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </motion.button>
  );
};

export default AnimatedButton;
