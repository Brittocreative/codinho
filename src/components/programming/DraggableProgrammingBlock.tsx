import React from 'react';
import { motion, useAnimation } from 'framer-motion';

interface DraggableProgrammingBlockProps {
  type: 'number' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'equals';
  value?: number | string;
  onDrop: (type: string, value?: number | string) => void;
  className?: string;
}

const DraggableProgrammingBlock: React.FC<DraggableProgrammingBlockProps> = ({
  type,
  value,
  onDrop,
  className = '',
}) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = React.useState(false);
  
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
  
  const handleDragStart = () => {
    setIsDragging(true);
    controls.start({
      scale: 1.1,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
    });
  };
  
  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    controls.start({
      scale: 1,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    });
    
    // Criar uma cópia do bloco quando for solto
    onDrop(type, value);
    
    // Animar o retorno à posição original
    controls.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    });
  };

  return (
    <motion.div
      className={`
        w-14 h-14 rounded-lg flex items-center justify-center
        text-white font-bold text-xl shadow-md
        ${blockStyles[type]}
        cursor-grab active:cursor-grabbing
        ${className}
      `}
      animate={controls}
      drag
      dragSnapToOrigin={true}
      whileHover={{ scale: 1.05 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
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

export default DraggableProgrammingBlock;
