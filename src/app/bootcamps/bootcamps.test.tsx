import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BootcampProvider } from '@/contexts/BootcampContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import BootcampsPage from '@/app/bootcamps/page';

// Mock dos hooks de contexto
jest.mock('@/contexts/BootcampContext', () => ({
  ...jest.requireActual('@/contexts/BootcampContext'),
  useBootcamps: () => ({
    bootcamps: [
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
    ],
    isLoading: false,
  }),
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

// Mock para window.location.href
const mockNavigate = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    href: jest.fn(),
  },
  writable: true,
});

describe('BootcampsPage', () => {
  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
  });
  
  test('renderiza a página de bootcamps corretamente', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <BootcampsPage />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Verificar elementos principais
    expect(screen.getByText('Escolha seu Projeto')).toBeInTheDocument();
    expect(screen.getByTestId('codinho-character')).toBeInTheDocument();
    expect(screen.getByText('Escolha um projeto para começar sua aventura na programação!')).toBeInTheDocument();
    
    // Verificar bootcamps
    expect(screen.getByText('Calculadora Mágica')).toBeInTheDocument();
    expect(screen.getByText('Anime um Personagem')).toBeInTheDocument();
    expect(screen.getByText('Jogo de Adivinhação')).toBeInTheDocument();
    
    // Verificar estados de desbloqueio
    expect(screen.getByText('Começar')).toBeInTheDocument();
    expect(screen.getAllByText('Complete o projeto anterior para desbloquear').length).toBe(2);
  });
  
  test('mostra indicadores de dificuldade corretamente', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <BootcampsPage />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Verificar texto de dificuldade
    expect(screen.getAllByText('Dificuldade:').length).toBe(3);
  });
  
  test('mostra progresso quando um bootcamp tem progresso', () => {
    // Sobrescrever o mock para incluir progresso
    jest.mock('@/contexts/BootcampContext', () => ({
      ...jest.requireActual('@/contexts/BootcampContext'),
      useBootcamps: () => ({
        bootcamps: [
          {
            id: 'calculator',
            title: 'Calculadora Mágica',
            description: 'Crie uma calculadora que faz contas como mágica!',
            difficulty: 1,
            isUnlocked: true,
            icon: '🧮',
            color: 'purple',
            progress: 40,
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
        ],
        isLoading: false,
      }),
    }));
    
    render(
      <BootcampProvider>
        <GamificationProvider>
          <BootcampsPage />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Verificar se o texto de progresso é exibido
    expect(screen.getByText('Progresso')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });
});
