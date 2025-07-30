// AI Service for handling OpenAI integration
// This will be expanded to include real API calls

export interface AIConfig {
  apiKey?: string;
  model: string;
  temperature: number;
}

export interface ChatContext {
  lessonPhase: string;
  participants: string[];
  previousMessages: string[];
  currentTopic: string;
}

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig = { model: 'gpt-4o', temperature: 0.7 }) {
    this.config = config;
  }

  async generateResponse(prompt: string, context: ChatContext): Promise<string> {
    // For MVP, we'll use scripted responses
    // Later, this will call OpenAI API
    
    if (!this.config.apiKey) {
      return this.getScriptedResponse(prompt, context);
    }

    try {
      // TODO: Implement actual OpenAI API call
      const response = await this.callOpenAI(prompt, context);
      return response;
    } catch (error) {
      console.error('AI API Error:', error);
      return this.getScriptedResponse(prompt, context);
    }
  }

  private async callOpenAI(prompt: string, context: ChatContext): Promise<string> {
    // This will be implemented with actual OpenAI API
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: this.config.temperature,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || this.getScriptedResponse(prompt, context);
  }

  private buildSystemPrompt(context: ChatContext): string {
    return `You are Ms. Adventure, an enthusiastic AI teacher leading a kids' entrepreneurship lesson for ages 8-11. 

Context:
- Lesson: Desert Island Survival & Entrepreneurship
- Phase: ${context.lessonPhase}
- Participants: ${context.participants.join(', ')}
- Current Topic: ${context.currentTopic}

Guidelines:
- Keep responses under 50 words
- Use encouraging, age-appropriate language
- Ask engaging questions
- Connect activities to entrepreneurship concepts
- Use emojis sparingly but effectively
- Maintain excitement and energy
- Encourage creativity and problem-solving
- Build on kids' ideas positively

Focus on teaching:
- Creative problem-solving
- Teamwork and collaboration
- Resource management
- Planning and organization
- Innovation and adaptation
- Leadership skills`;
  }

  private getScriptedResponse(prompt: string, context: ChatContext): string {
    const responses = {
      intro: [
        "Welcome, young entrepreneurs! I'm so excited to see what creative solutions you'll come up with today! 🌟",
        "Great to have everyone here! Are you ready to put your problem-solving skills to the test? 💪",
        "I can already see some brilliant minds at work! Let's dive into our adventure! 🚀"
      ],
      scenario: [
        "What an interesting perspective! That shows real entrepreneurial thinking! 💡",
        "I love how you're considering all the possibilities! That's exactly what successful people do! 🎯",
        "Fantastic idea! Can you tell us more about how that would work? 🤔"
      ],
      discussion: [
        "That's brilliant problem-solving! How would you convince others to try your idea? 🗣️",
        "Great strategic thinking! What resources would you need to make that happen? 📋",
        "I love that creativity! How could we build on that idea even more? ✨"
      ],
      planning: [
        "Excellent teamwork! That's exactly how successful businesses are built! 🤝",
        "Smart planning! What would be your backup plan if that didn't work? 🔄",
        "That shows real leadership thinking! How would you organize your team? 👥"
      ],
      summary: [
        "You've all shown incredible entrepreneurial skills today! 🌟",
        "I'm amazed by your creativity and problem-solving abilities! 🎉",
        "These are exactly the skills that successful entrepreneurs use every day! 💪"
      ]
    };

    const phaseResponses = responses[context.lessonPhase as keyof typeof responses] || responses.discussion;
    return phaseResponses[Math.floor(Math.random() * phaseResponses.length)];
  }

  setApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
  }
}

export const aiService = new AIService();