import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

interface GenerateResponseOptions {
  prompt: string;
  context?: Array<{
    content: string;
    metadata?: any;
  }>;
  conversationHistory?: Array<{
    role: 'user' | 'model';
    parts: string;
  }>;
  systemInstruction?: string;
}

interface GenerateResponseResult {
  response: string;
  thoughtSignature: {
    reasoning: string;
    contextUsed: string[];
    confidence: number;
  };
  model: string;
}

class AIService {
  private model: string;

  constructor() {
    this.model = 'gemini-2.0-flash-exp';
  }

  /**
   * Generate AI response with RAG context
   */
  async generateResponse(
    options: GenerateResponseOptions
  ): Promise<GenerateResponseResult> {
    try {
      const { prompt, context, conversationHistory, systemInstruction } = options;

      // Build system instruction with context
      let instruction = systemInstruction || `You are an expert business consultant specializing in pricing strategies, 
SaaS business models, and revenue optimization. Provide detailed, actionable advice based on the user's context.`;

      if (context && context.length > 0) {
        instruction += `\n\nRelevant Context:\n`;
        context.forEach((ctx, index) => {
          instruction += `\n${index + 1}. ${ctx.content}\n`;
        });
      }

      const model = genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: instruction,
      });

      // Build conversation history
      const history = conversationHistory || [];
      const chat = model.startChat({
        history: history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        })),
      });

      // Generate response
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const responseText = response.text();

      // Generate thought signature (reasoning process)
      const thoughtSignature = await this.generateThoughtSignature(
        prompt,
        responseText,
        context
      );

      return {
        response: responseText,
        thoughtSignature,
        model: this.model,
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Generate thought signature (meta-reasoning about the response)
   */
  private async generateThoughtSignature(
    prompt: string,
    response: string,
    context?: Array<{ content: string; metadata?: any }>
  ): Promise<{
    reasoning: string;
    contextUsed: string[];
    confidence: number;
  }> {
    try {
      const contextIds = context?.map((_, index) => `kb_${index}`) || [];
      
      // Analyze the response quality
      const model = genAI.getGenerativeModel({ model: this.model });
      
      const reasoningPrompt = `Analyze the following Q&A exchange and provide:
1. A brief explanation of the reasoning process used
2. Confidence level (0-1) in the response accuracy

Question: ${prompt}
Answer: ${response}

Respond in this format:
REASONING: [your reasoning]
CONFIDENCE: [0-1]`;

      const result = await model.generateContent(reasoningPrompt);
      const analysis = result.response.text();

      // Parse reasoning and confidence
      const reasoningMatch = analysis.match(/REASONING:\s*(.+?)(?=CONFIDENCE:|$)/s);
      const confidenceMatch = analysis.match(/CONFIDENCE:\s*([0-9.]+)/);

      const reasoning = reasoningMatch 
        ? reasoningMatch[1].trim() 
        : 'Applied domain knowledge and context to formulate response';
      const confidence = confidenceMatch 
        ? Math.min(Math.max(parseFloat(confidenceMatch[1]), 0), 1)
        : 0.85;

      return {
        reasoning,
        contextUsed: contextIds,
        confidence,
      };
    } catch (error) {
      console.error('Error generating thought signature:', error);
      // Return default thought signature if meta-reasoning fails
      return {
        reasoning: 'Applied domain knowledge to formulate response',
        contextUsed: context?.map((_, index) => `kb_${index}`) || [],
        confidence: 0.80,
      };
    }
  }

  /**
   * Generate simple completion without RAG
   */
  async generateCompletion(prompt: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating completion:', error);
      throw new Error('Failed to generate completion');
    }
  }
}

export const aiService = new AIService();
