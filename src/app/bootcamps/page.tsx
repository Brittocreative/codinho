import React from 'react';
import { motion } from 'framer-motion';
import CodinhoCharacter from '@/components/characters/CodinhoCharacter';
import TextBubble from '@/components/ui/TextBubble';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface BootcampCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  isUnlocked: boolean;
  icon: React.ReactNode;
  color: string;
  progress?: number;
  onClick: () => void;
}

const BootcampCard: React.FC<BootcampCardProps> = ({
  id,
  title,
  description,
  difficulty,
  isUnlocked,
  icon,
  color,
  progress = 0,
  onClick,
}) => {
  // Cores baseadas no parâmetro color
  const colors = {
    purple: {
      header: 'bg-purple-500',
      icon: 'bg-purple-100 text-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600',
    },
    blue: {
      header: 'bg-blue-500',
      icon: 'bg-blue-100 text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
    green: {
      header: 'bg-green-500',
      icon: 'bg-green-100 text-green-500',
      button: 'bg-green-500 hover:bg-green-600',
    },
    orange: {
      header: 'bg-orange-500',
      icon: 'bg-orange-100 text-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600',
    },
  };

  const colorClasses = colors[color as keyof typeof colors] || colors.purple;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
    >
      <div className={`h-3 ${colorClasses.header}`}></div>
      
      <div className="p-5">
        <div className="flex items-start">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mr-4 ${colorClasses.icon}`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                {title}
              </h3>
              
              {!isUnlocked && (
                <span className="text-gray-400 text-xl">🔒</span>
              )}
            </div>
            
            <p className={`text-sm mt-1 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {description}
            </p>
            
            <div className="flex items-center mt-2">
              <span className={`text-xs mr-2 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                Dificuldade:
              </span>
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-sm mr-1 ${
                      i < difficulty && isUnlocked 
                        ? 'text-amber-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {isUnlocked && progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${colorClasses.header}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          {isUnlocked ? (
            <AnimatedButton
              text={progress > 0 ? "Continuar" : "Começar"}
              variant={color as any}
              fullWidth={true}
              onClick={onClick}
            />
          ) : (
            <p className="text-gray-400 text-sm italic">
              Complete o projeto anterior para desbloquear
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Bootcamps() {
  const bootcamps = [
    {
      id: 'calculator',
      title: 'Calculadora Mágica',
      description: 'Crie uma calculadora que faz contas como mágica!',
      difficulty: 1,
      isUnlocked: true,
      icon: '🧮',
      color: 'purple',
      progress: 0,
    },
    {
      id: 'animation',
      title: 'Anime um Personagem',
      description: 'Faça um personagem se mover na tela com seus comandos!',
      difficulty: 2,
      isUnlocked: false,
      icon: '🎮',
      color: 'orange',
      progress: 0,
    },
    {
      id: 'game',
      title: 'Jogo de Adivinhação',
      description: 'Crie um jogo onde o computador tenta adivinhar seu número!',
      difficulty: 3,
      isUnlocked: false,
      icon: '🎲',
      color: 'green',
      progress: 0,
    },
  ];

  const handleBootcampClick = (id: string) => {
    // Navegar para a página do bootcamp
    window.location.href = `/bootcamps/${id}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 py-8 px-4">
      <motion.div 
        className="container-app"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white">Escolha seu Projeto</h1>
          
          <div className="bg-amber-400 px-3 py-1 rounded-full flex items-center">
            <span className="text-amber-600 mr-1">⭐</span>
            <span className="text-white font-bold">0</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-white bg-opacity-20 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CodinhoCharacter expression="excited" size="md" />
          
          <div className="ml-4 flex-1">
            <TextBubble 
              text="Escolha um projeto para começar sua aventura na programação!"
              typing={true}
              className="bg-white bg-opacity-90"
            />
          </div>
        </motion.div>
        
        <div className="space-y-4">
          {bootcamps.map((bootcamp) => (
            <BootcampCard
              key={bootcamp.id}
              {...bootcamp}
              onClick={() => handleBootcampClick(bootcamp.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
