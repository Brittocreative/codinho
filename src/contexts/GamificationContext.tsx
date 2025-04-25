import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para o sistema de gamificação
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'character' | 'theme' | 'sticker';
  icon: string;
  requiredLevel: number;
  isCollected: boolean;
  collectedAt?: Date;
}

interface GamificationContextType {
  achievements: Achievement[];
  rewards: Reward[];
  totalXp: number;
  currentLevel: number;
  recentlyUnlockedAchievement: Achievement | null;
  recentlyCollectedReward: Reward | null;
  loadGamificationData: () => Promise<void>;
  unlockAchievement: (id: string) => void;
  collectReward: (id: string) => void;
  addXp: (points: number) => void;
  clearRecentlyUnlockedAchievement: () => void;
  clearRecentlyCollectedReward: () => void;
  isLoading: boolean;
  error: string | null;
}

// Valor padrão para o contexto
const defaultContextValue: GamificationContextType = {
  achievements: [],
  rewards: [],
  totalXp: 0,
  currentLevel: 1,
  recentlyUnlockedAchievement: null,
  recentlyCollectedReward: null,
  loadGamificationData: async () => {},
  unlockAchievement: () => {},
  collectReward: () => {},
  addXp: () => {},
  clearRecentlyUnlockedAchievement: () => {},
  clearRecentlyCollectedReward: () => {},
  isLoading: false,
  error: null,
};

// Criar o contexto
const GamificationContext = createContext<GamificationContextType>(defaultContextValue);

// Hook personalizado para usar o contexto
export const useGamification = () => useContext(GamificationContext);

// Dados iniciais das conquistas
const initialAchievements: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro projeto',
    icon: '🏆',
    points: 50,
    isUnlocked: false,
  },
  {
    id: 'first_star',
    title: 'Estrela Iniciante',
    description: 'Ganhe sua primeira estrela',
    icon: '⭐',
    points: 30,
    isUnlocked: false,
  },
  {
    id: 'perfect_level',
    title: 'Perfeição',
    description: 'Ganhe 3 estrelas em um nível',
    icon: '🌟',
    points: 100,
    isUnlocked: false,
  },
  {
    id: 'calculator_master',
    title: 'Mestre da Calculadora',
    description: 'Complete o projeto da calculadora',
    icon: '🧮',
    points: 150,
    isUnlocked: false,
  },
  {
    id: 'dedication',
    title: 'Dedicação',
    description: 'Use o app por 3 dias seguidos',
    icon: '🔥',
    points: 80,
    isUnlocked: false,
  },
];

// Dados iniciais das recompensas
const initialRewards: Reward[] = [
  {
    id: 'robot_friend',
    title: 'Amigo Robô',
    description: 'Um novo amigo para o Codinho',
    type: 'character',
    icon: '🤖',
    requiredLevel: 2,
    isCollected: false,
  },
  {
    id: 'space_theme',
    title: 'Tema Espacial',
    description: 'Mude o visual do app para o espaço',
    type: 'theme',
    icon: '🚀',
    requiredLevel: 3,
    isCollected: false,
  },
  {
    id: 'star_sticker',
    title: 'Adesivo Estrela',
    description: 'Um adesivo brilhante para sua coleção',
    type: 'sticker',
    icon: '✨',
    requiredLevel: 1,
    isCollected: false,
  },
];

// Calcular o nível com base no XP
const calculateLevel = (xp: number): number => {
  // Fórmula simples: cada nível requer 100 * nível XP
  let level = 1;
  let requiredXp = 100;
  
  while (xp >= requiredXp) {
    xp -= requiredXp;
    level++;
    requiredXp = 100 * level;
  }
  
  return level;
};

// Calcular o XP necessário para o próximo nível
export const calculateRequiredXp = (level: number): number => {
  return 100 * level;
};

// Provider do contexto
export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [recentlyUnlockedAchievement, setRecentlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [recentlyCollectedReward, setRecentlyCollectedReward] = useState<Reward | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados de gamificação do armazenamento local ou usar os iniciais
  const loadGamificationData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tentar carregar conquistas do localStorage
      const savedAchievements = localStorage.getItem('codinho_achievements');
      
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements);
      } else {
        // Usar as conquistas iniciais se não houver dados salvos
        setAchievements(initialAchievements);
        // Salvar no localStorage
        localStorage.setItem('codinho_achievements', JSON.stringify(initialAchievements));
      }
      
      // Tentar carregar recompensas do localStorage
      const savedRewards = localStorage.getItem('codinho_rewards');
      
      if (savedRewards) {
        const parsedRewards = JSON.parse(savedRewards);
        setRewards(parsedRewards);
      } else {
        // Usar as recompensas iniciais se não houver dados salvos
        setRewards(initialRewards);
        // Salvar no localStorage
        localStorage.setItem('codinho_rewards', JSON.stringify(initialRewards));
      }
      
      // Tentar carregar XP do localStorage
      const savedXp = localStorage.getItem('codinho_xp');
      
      if (savedXp) {
        const parsedXp = parseInt(savedXp, 10);
        setTotalXp(parsedXp);
        setCurrentLevel(calculateLevel(parsedXp));
      } else {
        // Usar XP inicial se não houver dados salvos
        setTotalXp(0);
        setCurrentLevel(1);
        // Salvar no localStorage
        localStorage.setItem('codinho_xp', '0');
      }
    } catch (err) {
      console.error('Erro ao carregar dados de gamificação:', err);
      setError('Não foi possível carregar os dados de gamificação. Por favor, tente novamente.');
      // Usar os dados iniciais em caso de erro
      setAchievements(initialAchievements);
      setRewards(initialRewards);
      setTotalXp(0);
      setCurrentLevel(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Desbloquear uma conquista
  const unlockAchievement = (id: string) => {
    setAchievements(prevAchievements => {
      const achievement = prevAchievements.find(a => a.id === id);
      
      // Se a conquista não existir ou já estiver desbloqueada, não fazer nada
      if (!achievement || achievement.isUnlocked) {
        return prevAchievements;
      }
      
      // Atualizar a conquista
      const updatedAchievements = prevAchievements.map(a => {
        if (a.id === id) {
          const unlockedAchievement = { 
            ...a, 
            isUnlocked: true, 
            unlockedAt: new Date() 
          };
          
          // Definir como conquista recentemente desbloqueada
          setRecentlyUnlockedAchievement(unlockedAchievement);
          
          // Adicionar XP
          addXp(a.points);
          
          return unlockedAchievement;
        }
        return a;
      });
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_achievements', JSON.stringify(updatedAchievements));
      
      return updatedAchievements;
    });
  };

  // Coletar uma recompensa
  const collectReward = (id: string) => {
    setRewards(prevRewards => {
      const reward = prevRewards.find(r => r.id === id);
      
      // Se a recompensa não existir, já estiver coletada ou o nível for insuficiente, não fazer nada
      if (!reward || reward.isCollected || currentLevel < reward.requiredLevel) {
        return prevRewards;
      }
      
      // Atualizar a recompensa
      const updatedRewards = prevRewards.map(r => {
        if (r.id === id) {
          const collectedReward = { 
            ...r, 
            isCollected: true, 
            collectedAt: new Date() 
          };
          
          // Definir como recompensa recentemente coletada
          setRecentlyCollectedReward(collectedReward);
          
          return collectedReward;
        }
        return r;
      });
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_rewards', JSON.stringify(updatedRewards));
      
      return updatedRewards;
    });
  };

  // Adicionar XP
  const addXp = (points: number) => {
    setTotalXp(prevXp => {
      const newXp = prevXp + points;
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_xp', newXp.toString());
      
      // Verificar se subiu de nível
      const newLevel = calculateLevel(newXp);
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        
        // Verificar se há novas recompensas para coletar
        rewards.forEach(reward => {
          if (!reward.isCollected && reward.requiredLevel <= newLevel) {
            // Notificar sobre recompensas disponíveis
            // (Não coletamos automaticamente para dar ao usuário a satisfação de coletar)
          }
        });
      }
      
      return newXp;
    });
  };

  // Limpar a conquista recentemente desbloqueada
  const clearRecentlyUnlockedAchievement = () => {
    setRecentlyUnlockedAchievement(null);
  };

  // Limpar a recompensa recentemente coletada
  const clearRecentlyCollectedReward = () => {
    setRecentlyCollectedReward(null);
  };

  // Carregar dados de gamificação ao montar o componente
  useEffect(() => {
    loadGamificationData();
  }, []);

  const value = {
    achievements,
    rewards,
    totalXp,
    currentLevel,
    recentlyUnlockedAchievement,
    recentlyCollectedReward,
    loadGamificationData,
    unlockAchievement,
    collectReward,
    addXp,
    clearRecentlyUnlockedAchievement,
    clearRecentlyCollectedReward,
    isLoading,
    error,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
