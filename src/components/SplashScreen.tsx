import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, MessageCircle } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen = ({ onStart }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-accent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-white/20 rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`text-center space-y-8 transform transition-all duration-1000 ${
        isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* App Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Young Entrepreneurs
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Desert Island Adventure
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Users className="w-5 h-5" />
            <span className="font-medium">Lesson 1 • Group Chat</span>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-white/90 text-lg leading-relaxed">
            Join your classmates in an exciting entrepreneurship adventure! 
            Work together to solve challenges and learn about creativity and business.
          </p>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <Button 
            onClick={onStart}
            variant="fun"
            size="xl"
            className="text-xl font-bold px-12 py-4 bg-white text-primary hover:scale-110 hover:bg-white/95 shadow-2xl"
          >
            Start Adventure! 🚀
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 text-white/60 text-sm">
          <p>Get ready for an amazing learning experience!</p>
        </div>
      </div>
    </div>
  );
};