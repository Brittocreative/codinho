import React from 'react';
import { motion } from 'framer-motion';
import { useGamification, Reward } from '@/contexts/GamificationContext';
import RewardCollectionModal from '@/components/gamification/RewardCollectionModal';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CodinhoCharacter from '@/components/characters/CodinhoCharacter';
import TextBubble from '@/components/ui/TextBubble';
import FloatingAnimation from '@/components/animations/FloatingAnimation';

export default function RewardsPage() {
  const { 
    rewards, 
    currentLevel, 
    recentlyCollectedReward,
    collectReward,
    clearRecentlyCollectedReward,
    isLoading 
  } = useGamification();
  
  const [showRewardModal, setShowRewardModal] = React.useState(false);
  const [selectedReward, setSelectedReward] = React.useState<Reward | null>(null);
  
  // Mostrar modal de recompensa quando uma nova recompensa for coletada
  React.useEffect(() => {
    if (recentlyCollectedReward) {
      setSelectedReward(recentlyCollectedReward);
      setShowRewardModal(true);
    }
  }, [recentlyCollectedReward]);
  
  // Fechar o modal de recompensa
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    clearRecentlyCollectedReward();
  };
  
  // Filtrar recompensas por tipo
  const characterRewards = rewards.filter(reward => reward.type === 'character');
  const themeRewards = rewards.filter(reward => reward.type === 'theme');
  const stickerRewards = rewards.filter(reward => reward.type === 'sticker');
  
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
      {/* Modal de recompensa */}
      {selectedReward && (
        <RewardCollectionModal
          isOpen={showRewardModal}
          title={selectedReward.title}
          description={selectedReward.description}
          icon={selectedReward.icon}
          type={selectedReward.type}
          onClose={handleCloseRewardModal}
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
          <h1 className="text-2xl font-bold text-white">Suas Recompensas</h1>
          
          <div className="bg-white px-3 py-1 rounded-full text-blue-600 font-bold">
            Nível {currentLevel}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-white bg-opacity-20 rounded-xl p-4 mb-6"
          variants={itemVariants}
        >
          <CodinhoCharacter expression="excited" size="md" />
          
          <div className="ml-4 flex-1">
            <TextBubble 
              text="Colete recompensas especiais à medida que avança nos níveis!"
              typing={true}
              className="bg-white bg-opacity-90"
            />
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="text-center py-4 bg-white rounded-xl">
            <p>Carregando recompensas...</p>
          </div>
        ) : (
          <>
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-lg mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personagens</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {characterRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    className={`
                      bg-white border rounded-lg p-4 text-center
                      ${reward.isCollected ? 'border-green-500' : currentLevel >= reward.requiredLevel ? 'border-amber-500' : 'border-gray-300 opacity-70'}
                    `}
                    whileHover={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 1.05 } : {}}
                    whileTap={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 0.95 } : {}}
                  >
                    {reward.isCollected ? (
                      <FloatingAnimation amplitude={5} duration={2}>
                        <div className="text-5xl mb-3">{reward.icon}</div>
                      </FloatingAnimation>
                    ) : (
                      <div className="text-5xl mb-3">{reward.icon}</div>
                    )}
                    
                    <h3 className="font-bold text-sm mb-1">{reward.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{reward.description}</p>
                    
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
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-lg mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Temas</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {themeRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    className={`
                      bg-white border rounded-lg p-4 text-center
                      ${reward.isCollected ? 'border-green-500' : currentLevel >= reward.requiredLevel ? 'border-amber-500' : 'border-gray-300 opacity-70'}
                    `}
                    whileHover={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 1.05 } : {}}
                    whileTap={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 0.95 } : {}}
                  >
                    <div className="text-4xl mb-3">{reward.icon}</div>
                    <h3 className="font-bold text-sm mb-1">{reward.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{reward.description}</p>
                    
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
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-lg"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Adesivos</h2>
              
              <div className="grid grid-cols-3 gap-3">
                {stickerRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    className={`
                      bg-white border rounded-lg p-3 text-center
                      ${reward.isCollected ? 'border-green-500' : currentLevel >= reward.requiredLevel ? 'border-amber-500' : 'border-gray-300 opacity-70'}
                    `}
                    whileHover={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 1.05 } : {}}
                    whileTap={currentLevel >= reward.requiredLevel && !reward.isCollected ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (currentLevel >= reward.requiredLevel && !reward.isCollected) {
                        collectReward(reward.id);
                      }
                    }}
                  >
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h3 className="font-bold text-xs mb-1">{reward.title}</h3>
                    
                    {reward.isCollected ? (
                      <span className="text-xs text-green-500 font-medium">✓</span>
                    ) : currentLevel >= reward.requiredLevel ? (
                      <span className="text-xs text-amber-500 font-medium">Disponível</span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Nível {reward.requiredLevel}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
