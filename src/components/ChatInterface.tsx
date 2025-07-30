import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Users } from 'lucide-react';
import { Message, Kid, LessonState } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lessonState, setLessonState] = useState<LessonState>({
    currentPhase: 'intro',
    currentSpeaker: null,
    participantIndex: 0,
    isComplete: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock kids data
  const kids: Kid[] = [
    { id: 'kid1', name: 'Emma', avatar: '👧', personality: 'creative and energetic' },
    { id: 'kid2', name: 'Lucas', avatar: '👦', personality: 'logical and thoughtful' },
    { id: 'kid3', name: 'Zoe', avatar: '👧', personality: 'adventurous and bold' },
    { id: 'kid4', name: 'Max', avatar: '👦', personality: 'funny and optimistic' },
    { id: 'kid5', name: 'Aria', avatar: '👧', personality: 'curious and analytical' },
    { id: 'kid6', name: 'Sam', avatar: '👦', personality: 'helpful and kind' },
  ];

  const aiTeacher = {
    id: 'ai-teacher',
    name: 'Ms. Adventure',
    type: 'ai' as const
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start the lesson when component mounts
  useEffect(() => {
    startLesson();
  }, []);

  const addMessage = (content: string, sender: any) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = async (duration: number = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const simulateAIResponse = async (prompt: string) => {
    await simulateTyping();
    // For now, we'll use scripted responses. Later we can integrate with OpenAI
    const responses = getAIResponse(prompt, lessonState.currentPhase);
    addMessage(responses, aiTeacher);
  };

  const simulateKidResponse = async (kidId: string) => {
    const kid = kids.find(k => k.id === kidId);
    if (!kid) return;

    await simulateTyping(1000);
    const response = getKidResponse(kid, lessonState.currentPhase);
    addMessage(response, { ...kid, type: 'kid' });
  };

  const startLesson = async () => {
    // Welcome message
    addMessage("🌟 Welcome to our Desert Island Adventure! I'm Ms. Adventure, and I'll be guiding you through this exciting entrepreneurship lesson today!", aiTeacher);
    
    await simulateTyping(2000);
    addMessage("We have an amazing group of young entrepreneurs here today! Let me see... Emma, Lucas, Zoe, Max, Aria, and Sam are all here. Are you all ready for an adventure? 🏝️", aiTeacher);
    
    // Simulate kids responding
    setTimeout(() => simulateKidResponse('kid1'), 3000);
    setTimeout(() => simulateKidResponse('kid4'), 4500);
    setTimeout(() => simulateKidResponse('kid3'), 6000);
    
    setTimeout(() => {
      setLessonState(prev => ({ ...prev, currentPhase: 'scenario' }));
      presentScenario();
    }, 8000);
  };

  const presentScenario = async () => {
    await simulateTyping(2000);
    addMessage("Alright everyone, here's our adventure scenario! 🚢", aiTeacher);
    
    await simulateTyping(2000);
    addMessage("Imagine this: You're on a boat trip with your friends when suddenly, your boat gets caught in a storm! The boat breaks down and you all wash up on a mysterious desert island. You're safe, but now you need to figure out what to do!", aiTeacher);
    
    await simulateTyping(2000);
    addMessage("This island has trees, fresh water, some fruits, and lots of interesting things to discover. The question is: What's the FIRST thing you would do? 🤔", aiTeacher);
    
    setTimeout(() => {
      setLessonState(prev => ({ ...prev, currentPhase: 'discussion' }));
      startDiscussion();
    }, 4000);
  };

  const startDiscussion = async () => {
    await simulateTyping(1500);
    addMessage("Let's hear from everyone! Emma, what would YOU do first if you found yourself on this island? 🌴", aiTeacher);
    
    setTimeout(() => simulateKidResponse('kid1'), 2000);
    setTimeout(() => continueDiscussion(), 5000);
  };

  const continueDiscussion = async () => {
    const responses = [
      () => {
        simulateAIResponse("That's a great idea, Emma! Safety first is always smart thinking. Lucas, what about you?");
        setTimeout(() => simulateKidResponse('kid2'), 3000);
      },
      () => {
        simulateAIResponse("Excellent thinking, Lucas! Being organized will definitely help. Zoe, what's your take?");
        setTimeout(() => simulateKidResponse('kid3'), 3000);
      },
      () => {
        simulateAIResponse("Wow, Zoe! I love that adventurous spirit! Max, how about you?");
        setTimeout(() => simulateKidResponse('kid4'), 3000);
      }
    ];

    if (lessonState.participantIndex < responses.length) {
      setTimeout(() => {
        responses[lessonState.participantIndex]();
        setLessonState(prev => ({ ...prev, participantIndex: prev.participantIndex + 1 }));
      }, 1000);
    } else {
      setTimeout(() => moveToPlanning(), 2000);
    }
  };

  const moveToPlanning = async () => {
    await simulateTyping(2000);
    addMessage("Fantastic ideas, everyone! I'm hearing themes about safety, exploration, organization, and teamwork. These are all key entrepreneurial skills! 💡", aiTeacher);
    
    await simulateTyping(2000);
    addMessage("Now, let's work together as a team. Can you create a plan that combines all these great ideas? What would be your step-by-step survival and exploration plan?", aiTeacher);
    
    setLessonState(prev => ({ ...prev, currentPhase: 'planning' }));
  };

  const getAIResponse = (prompt: string, phase: string): string => {
    // Scripted responses for different phases
    const responses = {
      intro: [
        "That's wonderful enthusiasm! I can see we have some real problem-solvers here!",
        "Great energy, team! This is exactly the kind of positive attitude we need for entrepreneurship!",
      ],
      discussion: [
        "Excellent point! That shows real strategic thinking!",
        "I love how you're considering different possibilities! That's what entrepreneurs do!",
        "That's creative thinking! Can you tell us more about why you chose that approach?",
      ],
      planning: [
        "That's a solid plan! How would you organize your team to make it happen?",
        "Great idea! What resources would you need to make that work?",
      ]
    };
    
    const phaseResponses = responses[phase as keyof typeof responses] || responses.intro;
    return phaseResponses[Math.floor(Math.random() * phaseResponses.length)];
  };

  const getKidResponse = (kid: Kid, phase: string): string => {
    const responses = {
      intro: {
        'kid1': "Yes! This sounds super exciting! I love adventures! 🎉",
        'kid2': "I'm ready! I've been thinking about this all week!",
        'kid3': "Bring it on! I'm not scared of any desert island! 💪",
        'kid4': "Haha, this is going to be fun! I hope there are coconuts! 🥥",
        'kid5': "I'm curious about what we'll discover! Ready to learn!",
        'kid6': "Count me in! I want to help everyone succeed! 🤝"
      },
      discussion: {
        'kid1': "I would first make sure everyone is okay and not hurt! Then maybe find shelter because we need a safe place to stay.",
        'kid2': "I think we should explore the island systematically. Make a map of where we are and what resources we can find.",
        'kid3': "I'd climb the highest tree or hill to see the whole island! We need to know what we're working with!",
        'kid4': "I'd look for food and water first! Can't think on an empty stomach, right? Plus, maybe we can find some cool fruit!",
        'kid5': "I would gather information - check what supplies we have, what skills each person brings, and what the island offers.",
        'kid6': "I'd make sure we all stay together and help anyone who's scared or needs support. Teamwork is everything!"
      }
    };
    
    const phaseResponses = responses[phase as keyof typeof responses];
    if (phaseResponses && kid.id in phaseResponses) {
      return phaseResponses[kid.id as keyof typeof phaseResponses];
    }
    
    return "That's a really interesting perspective!";
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    addMessage(currentInput, { id: 'user', name: 'You', type: 'user' });
    setCurrentInput('');
    
    // Simulate AI response
    setTimeout(() => {
      simulateAIResponse(currentInput);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              ← Back
            </Button>
            <div>
              <h2 className="font-semibold text-lg">Desert Island Adventure</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{kids.length + 1} participants</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Phase: {lessonState.currentPhase}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <ChatMessage 
            message={{
              id: 'typing',
              content: '',
              sender: aiTeacher,
              timestamp: Date.now()
            }}
            isTyping={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Share your thoughts..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!currentInput.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Join the discussion and share your ideas! 💭
        </p>
      </div>
    </div>
  );
};