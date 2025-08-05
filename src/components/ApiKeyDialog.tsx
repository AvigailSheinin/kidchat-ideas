import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Key } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: () => void;
}

export const ApiKeyDialog = ({ open, onOpenChange, onApiKeySet }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    
    try {
      // Validate the API key format
      if (provider === 'openai' && !apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format. OpenAI keys start with "sk-"');
      }
      if (provider === 'gemini' && !apiKey.startsWith('AIza')) {
        throw new Error('Invalid API key format. Gemini keys start with "AIza"');
      }

      // Set the provider and API key in the service
      aiService.setProvider(provider);
      aiService.setApiKey(apiKey);
      
      // Store in localStorage for persistence
      localStorage.setItem('ai_provider', provider);
      localStorage.setItem('ai_api_key', apiKey);
      
      toast({
        title: "API Key Set Successfully! 🎉",
        description: "You can now use real AI responses in the chat.",
      });
      
      onApiKeySet();
      onOpenChange(false);
      setApiKey('');
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description: error instanceof Error ? error.message : "Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Using Demo Mode",
      description: "The app will use scripted responses instead of AI.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Connect AI Assistant
          </DialogTitle>
          <DialogDescription>
            Choose your AI provider and add your API key to enable dynamic AI responses, or continue with demo mode using scripted responses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: 'openai' | 'gemini') => setProvider(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">{provider === 'openai' ? 'OpenAI' : 'Gemini'} API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={provider === 'openai' ? 'sk-...' : 'AIza...'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3 border border-border">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">How to get an API key:</p>
                {provider === 'openai' ? (
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">platform.openai.com</a></li>
                    <li>Sign up or log in to your account</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={!apiKey.trim() || isLoading} className="flex-1">
              {isLoading ? 'Connecting...' : 'Connect AI'}
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip}>
              Demo Mode
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};