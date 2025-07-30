import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  const isAI = message.sender.type === 'ai';
  const isUser = message.sender.type === 'user';

  const getAvatarColor = () => {
    if (isAI) return 'bg-chat-ai';
    if (isUser) return 'bg-chat-user';
    // Kid avatars get colorful random colors
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
    return colors[message.sender.id.charCodeAt(0) % colors.length];
  };

  const getBubbleColor = () => {
    if (isAI) return 'bg-chat-ai text-chat-ai-foreground';
    if (isUser) return 'bg-chat-user text-chat-user-foreground';
    return 'bg-chat-kid text-chat-kid-foreground';
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <Avatar className={`w-10 h-10 ${getAvatarColor()} flex-shrink-0`}>
        <AvatarFallback className="text-white font-semibold text-sm">
          {isAI ? (
            <Bot className="w-5 h-5" />
          ) : (
            message.sender.name.slice(0, 2).toUpperCase()
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender Name */}
        {!isUser && (
          <div className="text-xs text-muted-foreground mb-1 font-medium">
            {message.sender.name}
          </div>
        )}

        {/* Message Bubble */}
        <div 
          className={`
            px-4 py-3 rounded-2xl shadow-sm max-w-full break-words
            ${getBubbleColor()}
            ${isUser ? 'rounded-tr-md' : 'rounded-tl-md'}
            ${isTyping ? 'animate-pulse' : ''}
          `}
        >
          {isTyping ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};