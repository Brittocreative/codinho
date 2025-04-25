import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiCelebration from '@/components/animations/ConfettiCelebration';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface AchievementModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  title,
  description,
  icon,
  points,
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
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: [0.5, 1.2, 1],
      opacity: 1,
      transition: { 
        duration: 0.5,
        times: [0, 0.6, 1],
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
  
  // Variantes para os pontos
  const pointsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: [0, 1.5, 1],
      opacity: 1,
      transition: { 
        duration: 0.5,
        times: [0, 0.7, 1],
        delay: 0.7
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ConfettiCelebration isVisible={showConfetti} />
          
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2 
                className="text-amber-500 text-xl font-bold mb-4"
                variants={textVariants}
              >
                Conquista Desbloqueada!
              </motion.h2>
              
              <motion.div
                className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                variants={iconVariants}
              >
                {icon}
              </motion.div>
              
              <motion.h3 
                className="text-lg font-bold mb-2"
                variants={textVariants}
              >
                {title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 mb-4"
                variants={textVariants}
              >
                {description}
              </motion.p>
              
              <motion.div
                className="flex items-center justify-center mb-6"
                variants={pointsVariants}
              >
                <span className="text-amber-500 text-xl mr-2">⭐</span>
                <span className="text-amber-500 font-bold text-xl">+{points} XP</span>
              </motion.div>
              
              <AnimatedButton
                text="Incrível!"
                variant="primary"
                fullWidth={true}
                onClick={onClose}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;
