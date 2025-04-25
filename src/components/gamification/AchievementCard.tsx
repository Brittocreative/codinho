import React from 'react';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  points?: number;
  onClick?: () => void;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  unlocked,
  points = 0,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      className={`
        flex items-center p-4 rounded-xl mb-3
        ${unlocked ? 'bg-white shadow-md' : 'bg-gray-100 opacity-70'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={unlocked ? { scale: 1.02 } : {}}
      whileTap={unlocked && onClick ? { scale: 0.98 } : {}}
      onClick={unlocked && onClick ? onClick : undefined}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center mr-4
        ${unlocked ? 'bg-amber-100 text-amber-500' : 'bg-gray-200 text-gray-400'}
      `}>
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className={`font-bold text-base mb-1 ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {title}
        </h3>
        <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
        {unlocked && points > 0 && (
          <div className="flex items-center mt-1">
            <span className="text-amber-500 mr-1">⭐</span>
            <span className="text-sm font-bold text-amber-500">+{points} XP</span>
          </div>
        )}
      </div>
      
      {unlocked ? (
        <div className="text-green-500 text-xl">✓</div>
      ) : (
        <div className="text-gray-400 text-xl">🔒</div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
