import React from 'react';
import { motion } from 'framer-motion';
import CodinhoCharacter from '@/components/characters/CodinhoCharacter';
import TextBubble from '@/components/ui/TextBubble';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function Home() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [typingComplete, setTypingComplete] = React.useState(false);
  
  const welcomeSteps = [
    {
      text: "Olá! Eu sou o Codinho! Vamos aprender a programar juntos?",
      expression: "happy" as const,
    },
    {
      text: "Aqui você vai aprender programação de um jeito divertido, com projetos práticos e desafios!",
      expression: "excited" as const,
    },
    {
      text: "Vamos começar com projetos simples e ir avançando aos poucos. O primeiro projeto será uma calculadora!",
      expression: "happy" as const,
    },
  ];
  
  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTypingComplete(false);
    } else {
      // Navegar para a próxima página (seleção de bootcamps)
      window.location.href = '/bootcamps';
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Codinho</h1>
          <p className="text-xl text-white">Brinque e Programe</p>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-3xl p-6 shadow-xl"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center mb-6">
            <CodinhoCharacter 
              expression={welcomeSteps[currentStep].expression}
              size="lg"
              animate={true}
            />
          </div>
          
          <div className="mb-8">
            <TextBubble 
              text={welcomeSteps[currentStep].text}
              typing={true}
              onComplete={() => setTypingComplete(true)}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: typingComplete ? 1 : 0,
              y: typingComplete ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedButton
              text={currentStep < welcomeSteps.length - 1 ? "Continuar" : "Começar Aventura"}
              variant="primary"
              size="lg"
              fullWidth={true}
              onClick={handleNext}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-6 text-white text-sm"
          variants={itemVariants}
        >
          <p>© 2025 Codinho - Todos os direitos reservados</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
