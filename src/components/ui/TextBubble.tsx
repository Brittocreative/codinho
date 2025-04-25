import React from 'react';
import { motion } from 'framer-motion';

interface TextBubbleProps {
  text: string;
  typing?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  onComplete?: () => void;
}

const TextBubble: React.FC<TextBubbleProps> = ({
  text,
  typing = true,
  direction = 'left',
  className = '',
  onComplete,
}) => {
  // Variantes de animação para o efeito de digitação
  const typingVariants = {
    hidden: { width: '0%' },
    visible: { 
      width: '100%',
      transition: { 
        duration: 1.5,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.03,
        onComplete: onComplete
      }
    }
  };

  // Variantes para cada caractere
  const characterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Determina a posição da seta do balão
  const arrowPosition = direction === 'left' 
    ? 'left-[-8px] top-1/2 transform -translate-y-1/2 rotate-45' 
    : 'right-[-8px] top-1/2 transform -translate-y-1/2 rotate-45';

  return (
    <motion.div 
      className={`relative bg-white rounded-2xl p-4 shadow-md ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Seta do balão */}
      <div className={`absolute w-4 h-4 bg-white ${arrowPosition}`}></div>
      
      {/* Conteúdo do balão */}
      {typing ? (
        <motion.div
          className="overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={typingVariants}
        >
          <div className="whitespace-pre-wrap">
            {text.split('').map((char, index) => (
              <motion.span 
                key={index} 
                variants={characterVariants}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="whitespace-pre-wrap">{text}</div>
      )}
    </motion.div>
  );
};

export default TextBubble;
