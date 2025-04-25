import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GamificationProvider } from '@/contexts/GamificationContext';
import GamificationPage from '@/app/gamification/page';

// Mock dos hooks de contexto
jest.mock('@/contexts/GamificationContext', () => ({
  ...jest.requireActual('@/contexts/GamificationContext'),
  useGamification: () => ({
    achievements: [
      {
        id: 'first_step',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro projeto',
        icon: '🏆',
        points: 50,
        isUnlocked: true,
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
        id: 'calculator_master',
        title: 'Mestre da Calculadora',
        description: 'Complete o projeto da calculadora',
        icon: '🧮',
        points: 150,
        isUnlocked: false,
      },
    ],
    rewards: [
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
    ],
    totalXp: 120,
    currentLevel: 2,
    recentlyUnlockedAchievement: null,
    clearRecentlyUnlockedAchievement: jest.fn(),
    collectReward: jest.fn(),
    isLoading: false,
  }),
  calculateRequiredXp: () => 200,
}));

// Mock dos componentes com animações
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

jest.mock('@/components/characters/CodinhoCharacter', () => ({
  __esModule: true,
  default: () => <div data-testid="codinho-character">Codinho</div>,
}));

jest.mock('@/components/ui/TextBubble', () => ({
  __esModule: true,
  default: ({ text }) => <div data-testid="text-bubble">{text}</div>,
}));

jest.mock('@/components/gamification/LevelProgressBar', () => ({
  __esModule: true,
  default: ({ level, currentXp, requiredXp }) => (
    <div data-testid="level-progress-bar">
      Nível {level}: {currentXp}/{requiredXp} XP
    </div>
  ),
}));

jest.mock('@/components/gamification/AchievementCard', () => ({
  __esModule: true,
  default: ({ title, description, icon, unlocked, points }) => (
    <div data-testid={`achievement-${unlocked ? 'unlocked' : 'locked'}`}>
      {title} - {points} pontos
    </div>
  ),
}));

describe('GamificationPage', () => {
  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
  });
  
  test('renderiza a página de gamificação corretamente', () => {
    render(
      <GamificationProvider>
        <GamificationPage />
      </GamificationProvider>
    );
    
    // Verificar elementos principais
    expect(screen.getByText('Suas Conquistas')).toBeInTheDocument();
    expect(screen.getByTestId('codinho-character')).toBeInTheDocument();
    expect(screen.getByText('Desbloqueie conquistas e ganhe recompensas enquanto aprende a programar!')).toBeInTheDocument();
    
    // Verificar barra de progresso
    expect(screen.getByTestId('level-progress-bar')).toBeInTheDocument();
    
    // Verificar conquistas
    expect(screen.getByText('Conquistas')).toBeInTheDocument();
    expect(screen.getByText('Primeiro Passo - 50 pontos')).toBeInTheDocument();
    expect(screen.getByText('Estrela Iniciante - 30 pontos')).toBeInTheDocument();
    expect(screen.getByText('Mestre da Calculadora - 150 pontos')).toBeInTheDocument();
    
    // Verificar recompensas
    expect(screen.getByText('Recompensas')).toBeInTheDocument();
    expect(screen.getByText('Amigo Robô')).toBeInTheDocument();
    expect(screen.getByText('Tema Espacial')).toBeInTheDocument();
  });
  
  test('mostra conquistas desbloqueadas e bloqueadas corretamente', () => {
    render(
      <GamificationProvider>
        <GamificationPage />
      </GamificationProvider>
    );
    
    // Verificar conquistas desbloqueadas e bloqueadas
    expect(screen.getByTestId('achievement-unlocked')).toBeInTheDocument();
    expect(screen.getAllByTestId('achievement-locked').length).toBe(2);
  });
  
  test('mostra XP total corretamente', () => {
    render(
      <GamificationProvider>
        <GamificationPage />
      </GamificationProvider>
    );
    
    // Verificar XP total
    expect(screen.getByText('120')).toBeInTheDocument();
  });
});
