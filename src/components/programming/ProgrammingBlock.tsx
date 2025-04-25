import React from 'react';
import { motion } from 'framer-motion';

interface ProgrammingBlockProps {
  type: 'number' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'equals';
  value?: number | string;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  className?: string;
}

const ProgrammingBlock: React.FC<ProgrammingBlockProps> = ({
  type,
  value,
  draggable = true,
  onDragStart,
  onDragEnd,
  onClick,
  className = '',
}) => {
  // Configurações de estilo baseadas no tipo
  const blockStyles = {
    number: 'bg-blue-500 hover:bg-blue-600',
    addition: 'bg-green-500 hover:bg-green-600',
    subtraction: 'bg-red-500 hover:bg-red-600',
    multiplication: 'bg-orange-500 hover:bg-orange-600',
    division: 'bg-purple-500 hover:bg-purple-600',
    equals: 'bg-amber-500 hover:bg-amber-600',
  };

  // Conteúdo do bloco baseado no tipo
  const blockContent = {
    number: value?.toString() || '0',
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
    equals: '=',
  };

  return (
    <motion.div
      className={`
        w-14 h-14 rounded-lg flex items-center justify-center
        text-white font-bold text-xl shadow-md
        ${blockStyles[type]}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      drag={draggable}
      dragSnapToOrigin={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
        scale: {
          type: "spring",
          damping: 10,
          stiffness: 100,
        }
      }}
    >
      {blockContent[type]}
    </motion.div>
  );
};

export default ProgrammingBlock;
