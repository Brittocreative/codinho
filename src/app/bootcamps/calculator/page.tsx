import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootcamps } from '@/contexts/BootcampContext';
import { useGamification } from '@/contexts/GamificationContext';
import CodinhoCharacter from '@/components/characters/CodinhoCharacter';
import TextBubble from '@/components/ui/TextBubble';
import AnimatedButton from '@/components/ui/AnimatedButton';
import DraggableProgrammingBlock from '@/components/programming/DraggableProgrammingBlock';
import ProgrammingBlock from '@/components/programming/ProgrammingBlock';
import ConfettiCelebration from '@/components/animations/ConfettiCelebration';
import AchievementModal from '@/components/gamification/AchievementModal';

export default function CalculatorProject() {
  const { currentBootcamp, completeBootcampLevel } = useBootcamps();
  const { 
    unlockAchievement, 
    addXp, 
    recentlyUnlockedAchievement,
    clearRecentlyUnlockedAchievement 
  } = useGamification();
  
  const [level, setLevel] = React.useState(1);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [message, setMessage] = React.useState('Arraste os blocos para criar uma soma!');
  const [expression, setExpression] = React.useState<('happy' | 'excited' | 'thinking' | 'sad' | 'surprised')>('happy');
  const [result, setResult] = React.useState<number | null>(null);
  const [blocks, setBlocks] = React.useState<Array<{type: string, value?: number | string}>>([]);
  const [typingComplete, setTypingComplete] = React.useState(false);
  const [showAchievementModal, setShowAchievementModal] = React.useState(false);
  
  // Mostrar modal de conquista quando uma nova conquista for desbloqueada
  React.useEffect(() => {
    if (recentlyUnlockedAchievement) {
      setShowAchievementModal(true);
    }
  }, [recentlyUnlockedAchievement]);
  
  // Fechar o modal de conquista
  const handleCloseAchievementModal = () => {
    setShowAchievementModal(false);
    clearRecentlyUnlockedAchievement();
  };
  
  // Blocos disponíveis para o nível atual
  const availableBlocks = React.useMemo(() => {
    switch(level) {
      case 1:
        return [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'number', value: 5 },
          { type: 'addition' },
          { type: 'equals' },
        ];
      case 2:
        return [
          { type: 'number', value: 3 },
          { type: 'number', value: 7 },
          { type: 'number', value: 10 },
          { type: 'subtraction' },
          { type: 'equals' },
        ];
      case 3:
        return [
          { type: 'number', value: 2 },
          { type: 'number', value: 4 },
          { type: 'number', value: 5 },
          { type: 'multiplication' },
          { type: 'equals' },
        ];
      case 4:
        return [
          { type: 'number', value: 8 },
          { type: 'number', value: 2 },
          { type: 'number', value: 4 },
          { type: 'division' },
          { type: 'equals' },
        ];
      case 5:
        return [
          { type: 'number', value: 2 },
          { type: 'number', value: 3 },
          { type: 'number', value: 4 },
          { type: 'addition' },
          { type: 'multiplication' },
          { type: 'equals' },
        ];
      default:
        return [];
    }
  }, [level]);
  
  // Mensagens para cada nível
  const levelMessages = React.useMemo(() => {
    return {
      1: 'Arraste os blocos para criar uma soma!',
      2: 'Agora vamos tentar uma subtração!',
      3: 'Vamos multiplicar dois números!',
      4: 'Hora de dividir!',
      5: 'Uau! Agora vamos combinar operações!',
    };
  }, []);
  
  // Adicionar um bloco à expressão
  const addBlock = (type: string, value?: number | string) => {
    setBlocks([...blocks, { type, value }]);
    
    // Efeito sonoro de clique (em um ambiente real, adicionaríamos som)
    // playSound('click');
  };
  
  // Limpar todos os blocos
  const clearBlocks = () => {
    setBlocks([]);
    setResult(null);
  };
  
  // Remover o último bloco
  const removeLastBlock = () => {
    if (blocks.length > 0) {
      setBlocks(blocks.slice(0, -1));
      setResult(null);
    }
  };
  
  // Executar a expressão
  const executeExpression = () => {
    try {
      // Verificar se a expressão está completa
      if (blocks.length < 3 || blocks[blocks.length - 1].type !== 'equals') {
        setMessage('Sua expressão está incompleta! Termine com o sinal de igual.');
        setExpression('thinking');
        return;
      }
      
      // Construir e avaliar a expressão
      let expressionStr = '';
      let isValid = true;
      
      blocks.forEach((block, index) => {
        if (block.type === 'number') {
          expressionStr += block.value;
        } else if (block.type === 'addition') {
          expressionStr += '+';
        } else if (block.type === 'subtraction') {
          expressionStr += '-';
        } else if (block.type === 'multiplication') {
          expressionStr += '*';
        } else if (block.type === 'division') {
          expressionStr += '/';
        } else if (block.type === 'equals' && index !== blocks.length - 1) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        setMessage('O sinal de igual deve estar no final da expressão!');
        setExpression('thinking');
        return;
      }
      
      // Avaliar a expressão
      const calculatedResult = eval(expressionStr);
      setResult(calculatedResult);
      
      // Verificar se o nível foi concluído
      if (level === 1 && blocks.some(b => b.type === 'addition')) {
        celebrateSuccess();
      } else if (level === 2 && blocks.some(b => b.type === 'subtraction')) {
        celebrateSuccess();
      } else if (level === 3 && blocks.some(b => b.type === 'multiplication')) {
        celebrateSuccess();
      } else if (level === 4 && blocks.some(b => b.type === 'division')) {
        celebrateSuccess();
      } else if (level === 5 && 
                blocks.some(b => b.type === 'addition') && 
                blocks.some(b => b.type === 'multiplication')) {
        celebrateSuccess();
      } else {
        setMessage('Muito bem! Tente usar os blocos específicos deste nível.');
        setExpression('happy');
      }
    } catch (error) {
      setMessage('Ops! Algo deu errado na sua expressão. Tente novamente!');
      setExpression('sad');
    }
  };
  
  // Celebrar o sucesso e avançar para o próximo nível
  const celebrateSuccess = () => {
    setShowCelebration(true);
    setMessage('Incrível! Você completou o desafio!');
    setExpression('excited');
    
    // Adicionar XP
    addXp(20 * level);
    
    // Atualizar progresso do bootcamp
    if (currentBootcamp) {
      completeBootcampLevel(currentBootcamp.id, level);
    }
    
    // Desbloquear conquistas com base no nível
    if (level === 1) {
      unlockAchievement('first_step');
    } else if (level === 5) {
      unlockAchievement('calculator_master');
    }
    
    // Avançar para o próximo nível após 3 segundos
    setTimeout(() => {
      if (level < 5) {
        setLevel(level + 1);
        clearBlocks();
        setMessage(levelMessages[(level + 1) as keyof typeof levelMessages]);
        setExpression('happy');
      } else {
        setMessage('Parabéns! Você completou todos os níveis da calculadora!');
      }
      setShowCelebration(false);
    }, 3000);
  };
  
  // Variantes de animação
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
      <ConfettiCelebration isVisible={showCelebration} />
      
      {/* Modal de conquista */}
      {recentlyUnlockedAchievement && (
        <AchievementModal
          isOpen={showAchievementModal}
          title={recentlyUnlockedAchievement.title}
          description={recentlyUnlockedAchievement.description}
          icon={recentlyUnlockedAchievement.icon}
          points={recentlyUnlockedAchievement.points}
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
          <h1 className="text-2xl font-bold text-white">Calculadora Mágica</h1>
          
          <div className="bg-white px-3 py-1 rounded-full text-blue-600 font-bold">
            Nível {level}/5
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-white bg-opacity-20 rounded-xl p-4 mb-6"
          variants={itemVariants}
        >
          <CodinhoCharacter expression={expression} size="md" />
          
          <div className="ml-4 flex-1">
            <TextBubble 
              text={message}
              typing={true}
              className="bg-white bg-opacity-90"
              onComplete={() => setTypingComplete(true)}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 mb-6 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Resultado:</span>
            <span className="text-2xl font-bold text-blue-600">
              {result !== null ? result : '?'}
            </span>
          </div>
          
          <div className="min-h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-2 items-center justify-center mb-4">
            {blocks.length === 0 ? (
              <span className="text-gray-400 italic">Arraste blocos para cá</span>
            ) : (
              blocks.map((block, index) => (
                <ProgrammingBlock
                  key={index}
                  type={block.type as any}
                  value={block.value}
                  draggable={false}
                />
              ))
            )}
          </div>
          
          <div className="flex justify-center gap-3 mt-4">
            <AnimatedButton
              text="Limpar"
              variant="secondary"
              onClick={clearBlocks}
            />
            <AnimatedButton
              text="Remover"
              variant="warning"
              onClick={removeLastBlock}
            />
            <AnimatedButton
              text="Executar"
              variant="success"
              onClick={executeExpression}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-5 shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-bold text-gray-700 mb-3">Blocos Disponíveis</h3>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {availableBlocks.map((block, index) => (
              <DraggableProgrammingBlock
                key={index}
                type={block.type as any}
                value={block.value}
                onDrop={() => addBlock(block.type, block.value)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
