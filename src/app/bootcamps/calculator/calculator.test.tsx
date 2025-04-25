import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BootcampProvider } from '@/contexts/BootcampContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import CalculatorProject from '@/app/bootcamps/calculator/page';

// Mock dos hooks de contexto
jest.mock('@/contexts/BootcampContext', () => ({
  ...jest.requireActual('@/contexts/BootcampContext'),
  useBootcamps: () => ({
    currentBootcamp: {
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
    completeBootcampLevel: jest.fn(),
  }),
}));

jest.mock('@/contexts/GamificationContext', () => ({
  ...jest.requireActual('@/contexts/GamificationContext'),
  useGamification: () => ({
    unlockAchievement: jest.fn(),
    addXp: jest.fn(),
    recentlyUnlockedAchievement: null,
    clearRecentlyUnlockedAchievement: jest.fn(),
  }),
}));

// Mock dos componentes com animações
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('@/components/characters/CodinhoCharacter', () => ({
  __esModule: true,
  default: () => <div data-testid="codinho-character">Codinho</div>,
}));

jest.mock('@/components/ui/TextBubble', () => ({
  __esModule: true,
  default: ({ text, onComplete }) => {
    React.useEffect(() => {
      if (onComplete) onComplete();
    }, [onComplete]);
    return <div data-testid="text-bubble">{text}</div>;
  },
}));

jest.mock('@/components/ui/AnimatedButton', () => ({
  __esModule: true,
  default: ({ text, onClick }) => (
    <button data-testid={`button-${text.toLowerCase()}`} onClick={onClick}>
      {text}
    </button>
  ),
}));

jest.mock('@/components/programming/DraggableProgrammingBlock', () => ({
  __esModule: true,
  default: ({ type, value, onDrop }) => (
    <div 
      data-testid={`draggable-block-${type}${value ? `-${value}` : ''}`}
      onClick={onDrop}
    >
      {type} {value}
    </div>
  ),
}));

jest.mock('@/components/programming/ProgrammingBlock', () => ({
  __esModule: true,
  default: ({ type, value }) => (
    <div data-testid={`block-${type}${value ? `-${value}` : ''}`}>
      {type} {value}
    </div>
  ),
}));

jest.mock('@/components/animations/ConfettiCelebration', () => ({
  __esModule: true,
  default: () => <div data-testid="confetti">Confetti</div>,
}));

describe('CalculatorProject', () => {
  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
    
    // Mock para eval
    global.eval = jest.fn((expr) => {
      if (expr === '1+2') return 3;
      if (expr === '7-3') return 4;
      if (expr === '2*4') return 8;
      if (expr === '8/2') return 4;
      if (expr === '2+3*4') return 14;
      return 0;
    });
  });
  
  test('renderiza a página da calculadora corretamente', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <CalculatorProject />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Verificar elementos principais
    expect(screen.getByText('Calculadora Mágica')).toBeInTheDocument();
    expect(screen.getByText('Nível 1/5')).toBeInTheDocument();
    expect(screen.getByTestId('codinho-character')).toBeInTheDocument();
    expect(screen.getByText('Arraste os blocos para criar uma soma!')).toBeInTheDocument();
    expect(screen.getByText('Resultado:')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.getByText('Arraste blocos para cá')).toBeInTheDocument();
    
    // Verificar botões
    expect(screen.getByTestId('button-limpar')).toBeInTheDocument();
    expect(screen.getByTestId('button-remover')).toBeInTheDocument();
    expect(screen.getByTestId('button-executar')).toBeInTheDocument();
    
    // Verificar blocos disponíveis
    expect(screen.getByTestId('draggable-block-number-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-block-number-2')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-block-number-5')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-block-addition')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-block-equals')).toBeInTheDocument();
  });
  
  test('adiciona blocos à expressão quando clicados', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <CalculatorProject />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Inicialmente não deve haver blocos na expressão
    expect(screen.getByText('Arraste blocos para cá')).toBeInTheDocument();
    
    // Adicionar blocos
    fireEvent.click(screen.getByTestId('draggable-block-number-1'));
    fireEvent.click(screen.getByTestId('draggable-block-addition'));
    fireEvent.click(screen.getByTestId('draggable-block-number-2'));
    
    // Verificar se os blocos foram adicionados
    expect(screen.getByTestId('block-number-1')).toBeInTheDocument();
    expect(screen.getByTestId('block-addition')).toBeInTheDocument();
    expect(screen.getByTestId('block-number-2')).toBeInTheDocument();
    
    // Não deve mais mostrar a mensagem de arrastar blocos
    expect(screen.queryByText('Arraste blocos para cá')).not.toBeInTheDocument();
  });
  
  test('limpa todos os blocos quando o botão Limpar é clicado', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <CalculatorProject />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Adicionar blocos
    fireEvent.click(screen.getByTestId('draggable-block-number-1'));
    fireEvent.click(screen.getByTestId('draggable-block-addition'));
    fireEvent.click(screen.getByTestId('draggable-block-number-2'));
    
    // Verificar se os blocos foram adicionados
    expect(screen.getByTestId('block-number-1')).toBeInTheDocument();
    
    // Clicar no botão Limpar
    fireEvent.click(screen.getByTestId('button-limpar'));
    
    // Verificar se os blocos foram removidos
    expect(screen.queryByTestId('block-number-1')).not.toBeInTheDocument();
    expect(screen.getByText('Arraste blocos para cá')).toBeInTheDocument();
  });
  
  test('remove o último bloco quando o botão Remover é clicado', () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <CalculatorProject />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Adicionar blocos
    fireEvent.click(screen.getByTestId('draggable-block-number-1'));
    fireEvent.click(screen.getByTestId('draggable-block-addition'));
    fireEvent.click(screen.getByTestId('draggable-block-number-2'));
    
    // Clicar no botão Remover
    fireEvent.click(screen.getByTestId('button-remover'));
    
    // Verificar se o último bloco foi removido
    expect(screen.getByTestId('block-number-1')).toBeInTheDocument();
    expect(screen.getByTestId('block-addition')).toBeInTheDocument();
    expect(screen.queryByTestId('block-number-2')).not.toBeInTheDocument();
  });
  
  test('executa a expressão corretamente quando o botão Executar é clicado', async () => {
    render(
      <BootcampProvider>
        <GamificationProvider>
          <CalculatorProject />
        </GamificationProvider>
      </BootcampProvider>
    );
    
    // Adicionar blocos para uma expressão completa
    fireEvent.click(screen.getByTestId('draggable-block-number-1'));
    fireEvent.click(screen.getByTestId('draggable-block-addition'));
    fireEvent.click(screen.getByTestId('draggable-block-number-2'));
    fireEvent.click(screen.getByTestId('draggable-block-equals'));
    
    // Clicar no botão Executar
    fireEvent.click(screen.getByTestId('button-executar'));
    
    // Verificar se o resultado foi calculado
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
    
    // Verificar se a mensagem de sucesso é exibida
    expect(screen.getByText('Incrível! Você completou o desafio!')).toBeInTheDocument();
  });
});
