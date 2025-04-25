import React from 'react';
import { motion } from 'framer-motion';
import { useGamification, Achievement, calculateRequiredXp } from '@/contexts/GamificationContext';
import AchievementCard from '@/components/gamification/AchievementCard';
import AchievementModal from '@/components/gamification/AchievementModal';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CodinhoCharacter from '@/components/characters/CodinhoCharacter';
import TextBubble from '@/components/ui/TextBubble';

export default function GamificationPage() {
  const { 
    achievements, 
    rewards, 
    totalXp, 
    currentLevel, 
    recentlyUnlockedAchievement,
    clearRecentlyUnlockedAchievement,
    collectReward,
    isLoading 
  } = useGamification();
  
  const [showAchievementModal, setShowAchievementModal] = React.useState(false);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);
  
  // Mostrar modal de conquista quando uma nova conquista for desbloqueada
  React.useEffect(() => {
    if (recentlyUnlockedAchievement) {
      setSelectedAchievement(recentlyUnlockedAchievement);
      setShowAchievementModal(true);
    }
  }, [recentlyUnlockedAchievement]);
  
  // Fechar o modal de conquista
  const handleCloseAchievementModal = () => {
    setShowAchievementModal(false);
    clearRecentlyUnlockedAchievement();
  };
  
  // Calcular o XP necessário para o próximo nível
  const requiredXp = calculateRequiredXp(currentLevel);
  
  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 py-8 px-4">
      {/* Modal de conquista */}
      {selectedAchievement && (
        <AchievementModal
          isOpen={showAchievementModal}
          title={selectedAchievement.title}
          description={selectedAchievement.description}
          icon={selectedAchievement.icon}
          points={selectedAchievement.points}
          onClose={handleCloseAchievementModal}
        />
      )}
      
      <motion.div 
        className="container-app"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold text-white">Suas Conquistas</h1>
          
          <div className="bg-amber-400 px-3 py-1 rounded-full flex items-center">
            <span className="text-amber-600 mr-1">⭐</span>
            <span className="text-white font-bold">{totalXp}</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-white bg-opacity-20 rounded-xl p-4 mb-6"
          variants={itemVariants}
        >
          <CodinhoCharacter expression="excited" size="md" />
          
          <div className="ml-4 flex-1">
            <TextBubble 
              text="Desbloqueie conquistas e ganhe recompensas enquanto aprende a programar!"
              typing={true}
              className="bg-white bg-opacity-90"
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <LevelProgressBar
            level={currentLevel}
            currentXp={totalXp % requiredXp}
            requiredXp={requiredXp}
            className="mb-6"
          />
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-lg mb-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Conquistas</h2>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p>Carregando conquistas...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  icon={achievement.icon}
                  unlocked={achievement.isUnlocked}
                  points={achievement.points}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-lg"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recompensas</h2>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p>Carregando recompensas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  className={`
                    bg-white border rounded-lg p-3 text-center
                    ${reward.isCollected ? 'border-green-500' : currentLevel >= reward.requiredLevel ? 'border-amber-500' : 'border-gray-300 opacity-70'}
                  `}
                  whileHover={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 1.05 } : {}}
                  whileTap={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 0.95 } : {}}
                >
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{reward.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                  
                  {reward.isCollected ? (
                    <span className="text-xs text-green-500 font-medium">Coletado ✓</span>
                  ) : currentLevel >= reward.requiredLevel ? (
                    <AnimatedButton
                      text="Coletar"
                      variant="primary"
                      size="sm"
                      onClick={() => collectReward(reward.id)}
                    />
                  ) : (
                    <span className="text-xs text-gray-500">
                      Nível {reward.requiredLevel} necessário
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
