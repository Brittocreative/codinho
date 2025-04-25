import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para o sistema de bootcamps
export interface Bootcamp {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  isUnlocked: boolean;
  icon: string;
  color: string;
  progress: number;
  levels: number;
  currentLevel: number;
  completedLevels: number[];
}

interface BootcampContextType {
  bootcamps: Bootcamp[];
  currentBootcamp: Bootcamp | null;
  loadBootcamps: () => Promise<void>;
  selectBootcamp: (id: string) => void;
  updateBootcampProgress: (id: string, progress: number) => void;
  completeBootcampLevel: (id: string, level: number) => void;
  unlockBootcamp: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

// Valor padrão para o contexto
const defaultContextValue: BootcampContextType = {
  bootcamps: [],
  currentBootcamp: null,
  loadBootcamps: async () => {},
  selectBootcamp: () => {},
  updateBootcampProgress: () => {},
  completeBootcampLevel: () => {},
  unlockBootcamp: () => {},
  isLoading: false,
  error: null,
};

// Criar o contexto
const BootcampContext = createContext<BootcampContextType>(defaultContextValue);

// Hook personalizado para usar o contexto
export const useBootcamps = () => useContext(BootcampContext);

// Dados iniciais dos bootcamps
const initialBootcamps: Bootcamp[] = [
  {
    id: 'calculator',
    title: 'Calculadora Mágica',
    description: 'Crie uma calculadora que faz contas como mágica!',
    difficulty: 1,
    isUnlocked: true,
    icon: '🧮',
    color: 'purple',
    progress: 0,
    levels: 5,
    currentLevel: 1,
    completedLevels: [],
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
    levels: 5,
    currentLevel: 1,
    completedLevels: [],
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
    levels: 5,
    currentLevel: 1,
    completedLevels: [],
  },
];

// Provider do contexto
export const BootcampProvider = ({ children }: { children: ReactNode }) => {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [currentBootcamp, setCurrentBootcamp] = useState<Bootcamp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar bootcamps do armazenamento local ou usar os iniciais
  const loadBootcamps = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tentar carregar do localStorage
      const savedBootcamps = localStorage.getItem('codinho_bootcamps');
      
      if (savedBootcamps) {
        const parsedBootcamps = JSON.parse(savedBootcamps);
        setBootcamps(parsedBootcamps);
      } else {
        // Usar os bootcamps iniciais se não houver dados salvos
        setBootcamps(initialBootcamps);
        // Salvar no localStorage
        localStorage.setItem('codinho_bootcamps', JSON.stringify(initialBootcamps));
      }
    } catch (err) {
      console.error('Erro ao carregar bootcamps:', err);
      setError('Não foi possível carregar os projetos. Por favor, tente novamente.');
      // Usar os bootcamps iniciais em caso de erro
      setBootcamps(initialBootcamps);
    } finally {
      setIsLoading(false);
    }
  };

  // Selecionar um bootcamp pelo ID
  const selectBootcamp = (id: string) => {
    const bootcamp = bootcamps.find(b => b.id === id) || null;
    setCurrentBootcamp(bootcamp);
  };

  // Atualizar o progresso de um bootcamp
  const updateBootcampProgress = (id: string, progress: number) => {
    setBootcamps(prevBootcamps => {
      const updatedBootcamps = prevBootcamps.map(bootcamp => {
        if (bootcamp.id === id) {
          return { ...bootcamp, progress };
        }
        return bootcamp;
      });
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_bootcamps', JSON.stringify(updatedBootcamps));
      
      return updatedBootcamps;
    });
    
    // Atualizar o bootcamp atual se for o mesmo
    if (currentBootcamp?.id === id) {
      setCurrentBootcamp(prev => prev ? { ...prev, progress } : null);
    }
  };

  // Completar um nível de bootcamp
  const completeBootcampLevel = (id: string, level: number) => {
    setBootcamps(prevBootcamps => {
      const updatedBootcamps = prevBootcamps.map(bootcamp => {
        if (bootcamp.id === id) {
          // Adicionar o nível aos níveis completados se ainda não estiver
          const completedLevels = bootcamp.completedLevels.includes(level)
            ? bootcamp.completedLevels
            : [...bootcamp.completedLevels, level];
          
          // Calcular o próximo nível
          const nextLevel = Math.min(level + 1, bootcamp.levels);
          
          // Calcular o progresso baseado nos níveis completados
          const progress = Math.round((completedLevels.length / bootcamp.levels) * 100);
          
          return { 
            ...bootcamp, 
            completedLevels, 
            currentLevel: nextLevel,
            progress
          };
        }
        return bootcamp;
      });
      
      // Verificar se devemos desbloquear o próximo bootcamp
      const completedBootcamp = updatedBootcamps.find(b => b.id === id);
      if (completedBootcamp && completedBootcamp.progress === 100) {
        // Encontrar o próximo bootcamp para desbloquear
        const nextBootcampIndex = updatedBootcamps.findIndex(b => !b.isUnlocked);
        if (nextBootcampIndex !== -1) {
          updatedBootcamps[nextBootcampIndex].isUnlocked = true;
        }
      }
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_bootcamps', JSON.stringify(updatedBootcamps));
      
      return updatedBootcamps;
    });
    
    // Atualizar o bootcamp atual se for o mesmo
    if (currentBootcamp?.id === id) {
      setCurrentBootcamp(prev => {
        if (!prev) return null;
        
        const completedLevels = prev.completedLevels.includes(level)
          ? prev.completedLevels
          : [...prev.completedLevels, level];
        
        const nextLevel = Math.min(level + 1, prev.levels);
        const progress = Math.round((completedLevels.length / prev.levels) * 100);
        
        return { 
          ...prev, 
          completedLevels, 
          currentLevel: nextLevel,
          progress
        };
      });
    }
  };

  // Desbloquear um bootcamp
  const unlockBootcamp = (id: string) => {
    setBootcamps(prevBootcamps => {
      const updatedBootcamps = prevBootcamps.map(bootcamp => {
        if (bootcamp.id === id) {
          return { ...bootcamp, isUnlocked: true };
        }
        return bootcamp;
      });
      
      // Atualizar o localStorage
      localStorage.setItem('codinho_bootcamps', JSON.stringify(updatedBootcamps));
      
      return updatedBootcamps;
    });
  };

  // Carregar bootcamps ao montar o componente
  useEffect(() => {
    loadBootcamps();
  }, []);

  const value = {
    bootcamps,
    currentBootcamp,
    loadBootcamps,
    selectBootcamp,
    updateBootcampProgress,
    completeBootcampLevel,
    unlockBootcamp,
    isLoading,
    error,
  };

  return (
    <BootcampContext.Provider value={value}>
      {children}
    </BootcampContext.Provider>
  );
};
