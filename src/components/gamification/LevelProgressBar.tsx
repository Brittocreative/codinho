import React from 'react';
import { motion, useAnimation } from 'framer-motion';

interface LevelProgressBarProps {
  level: number;
  currentXp: number;
  requiredXp: number;
  onLevelUp?: () => void;
  className?: string;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  level,
  currentXp,
  requiredXp,
  onLevelUp,
  className = '',
}) => {
  const progressControls = useAnimation();
  const levelBadgeControls = useAnimation();
  const [isLevelingUp, setIsLevelingUp] = React.useState(false);
  const [displayLevel, setDisplayLevel] = React.useState(level);
  const [displayXp, setDisplayXp] = React.useState(currentXp);
  
  // Calcular a porcentagem de progresso
  const progressPercentage = Math.min(100, (currentXp / requiredXp) * 100);
  
  React.useEffect(() => {
    // Animar a barra de progresso
    progressControls.start({
      width: `${progressPercentage}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    });
    
    // Verificar se o usuário subiu de nível
    if (currentXp >= requiredXp && !isLevelingUp) {
      handleLevelUp();
    } else {
      // Atualizar o XP exibido com animação de contagem
      animateXpCounter(displayXp, currentXp);
    }
  }, [currentXp, requiredXp, progressPercentage]);
  
  // Animar a contagem de XP
  const animateXpCounter = (from: number, to: number) => {
    const duration = 1000; // 1 segundo
    const startTime = Date.now();
    const difference = to - from;
    
    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const currentValue = Math.floor(from + difference * progress);
      setDisplayXp(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  // Lidar com o aumento de nível
  const handleLevelUp = () => {
    setIsLevelingUp(true);
    
    // Animar o emblema de nível
    levelBadgeControls.start({
      scale: [1, 1.2, 1],
      backgroundColor: ["#ffffff", "#ffc107", "#ffffff"],
      boxShadow: [
        "0px 4px 8px rgba(0, 0, 0, 0.1)",
        "0px 0px 30px rgba(255, 193, 7, 0.8)",
        "0px 4px 8px rgba(0, 0, 0, 0.1)"
      ],
      transition: { duration: 1.5 }
    }).then(() => {
      // Atualizar o nível exibido
      setDisplayLevel(level + 1);
      
      // Resetar o XP exibido
      setDisplayXp(currentXp - requiredXp);
      
      // Chamar o callback de aumento de nível
      if (onLevelUp) onLevelUp();
      
      // Resetar o estado de aumento de nível
      setIsLevelingUp(false);
    });
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <motion.div
            className="w-12 h-12 bg-white rounded-full shadow-md flex flex-col items-center justify-center mr-3"
            animate={levelBadgeControls}
          >
            <span className="text-lg font-bold text-blue-600">{displayLevel}</span>
            <span className="text-xs text-blue-600">Nível</span>
          </motion.div>
          
          <div>
            <h3 className="font-bold text-gray-800">Seu Progresso</h3>
            <p className="text-sm text-gray-600">
              {displayXp} / {requiredXp} XP para o próximo nível
            </p>
          </div>
        </div>
        
        <motion.div
          className="text-amber-500 text-xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ⭐
        </motion.div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: 0 }}
          animate={progressControls}
        />
      </div>
    </div>
  );
};

export default LevelProgressBar;
