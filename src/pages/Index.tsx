import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { ChatInterface } from '@/components/ChatInterface';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';
import { aiService } from '@/services/aiService';

const Index = () => {
  const [currentView, setCurrentView] = useState<'splash' | 'chat'>('splash');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      aiService.setApiKey(savedApiKey);
    }
  }, []);

  const handleStartLesson = () => {
    // Check if we should prompt for API key
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (!savedApiKey) {
      setShowApiKeyDialog(true);
    } else {
      setCurrentView('chat');
    }
  };

  const handleBackToSplash = () => {
    setCurrentView('splash');
  };

  const handleApiKeySet = () => {
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'splash' ? (
        <SplashScreen onStart={handleStartLesson} />
      ) : (
        <ChatInterface onBack={handleBackToSplash} />
      )}
      
      <ApiKeyDialog 
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySet={handleApiKeySet}
      />
    </div>
  );
};

export default Index;
