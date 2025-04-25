import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import ConfettiCelebration from '@/components/animations/ConfettiCelebration';
import AnimatedButton from '@/components/ui/AnimatedButton';
import FloatingAnimation from '@/components/animations/FloatingAnimation';

interface RewardCollectionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'character' | 'theme' | 'sticker';
  onClose: () => void;
}

const RewardCollectionModal: React.FC<RewardCollectionModalProps> = ({
  isOpen,
  title,
  description,
  icon,
  type,
  onClose,
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  
  React.useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Desativar confetes após 3 segundos
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Variantes de animação para o modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.2 
      }
    }
  };
  
  // Variantes para o ícone
  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0, rotate: -10 },
    visible: { 
      scale: [0.5, 1.2, 1],
      opacity: 1,
      rotate: [0, 10, 0, -10, 0],
      transition: { 
        duration: 1,
        times: [0, 0.4, 0.6, 0.8, 1],
        delay: 0.3
      }
    }
  };
  
  // Variantes para o texto
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.5
      }
    }
  };

  // Cores baseadas no tipo de recompensa
  const typeColors = {
    character: 'bg-purple-100 text-purple-500',
    theme: 'bg-blue-100 text-blue-500',
    sticker: 'bg-amber-100 text-amber-500'
  };

  return (
    <motion.div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isOpen ? '' : 'hidden'}`}
      variants={backdropVariants}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
    >
      <ConfettiCelebration isVisible={showConfetti} />
      
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
        variants={modalVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <motion.h2 
          className="text-blue-500 text-xl font-bold mb-4"
          variants={textVariants}
        >
          Nova Recompensa!
        </motion.h2>
        
        <FloatingAnimation amplitude={5} duration={2}>
          <motion.div
            className={`w-32 h-32 ${typeColors[type]} rounded-full flex items-center justify-center mx-auto mb-4 text-5xl`}
            variants={iconVariants}
          >
            {icon}
          </motion.div>
        </FloatingAnimation>
        
        <motion.h3 
          className="text-lg font-bold mb-2"
          variants={textVariants}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 mb-6"
          variants={textVariants}
        >
          {description}
        </motion.p>
        
        <AnimatedButton
          text="Incrível!"
          variant="primary"
          fullWidth={true}
          onClick={onClose}
        />
      </motion.div>
    </motion.div>
  );
};

export default RewardCollectionModal;
