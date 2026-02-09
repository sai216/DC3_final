import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/aiService.js';
import { embeddingService } from '../services/embeddingService.js';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

class ChatController {
  /**
   * POST /api/chat/generate
   * Generate AI response with RAG context
   */
  async generateResponse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId, prompt, context } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'prompt is required',
        });
        return;
      }

      let conversation = null;
      let conversationHistory: any[] = [];

      // Get conversation history if sessionId provided
      if (sessionId) {
        conversation = await prisma.conversation.findUnique({
          where: { id: sessionId },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' },
              take: 10, // Last 10 messages for context
            },
          },
        });

        if (conversation) {
          conversationHistory = conversation.messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.content,
          }));
        }
      }

      // Perform RAG search for relevant context
      const { embedding: queryEmbedding } = await embeddingService.generateEmbedding(prompt);
      
      const kbEntries = await prisma.knowledgeBase.findMany();
      const embeddings = kbEntries
        .filter((entry) => entry.embedding)
        .map((entry) => ({
          id: entry.id,
          embedding: entry.embedding as any as number[],
          content: entry.content,
          metadata: entry.metadata,
        }));

      const ragResults = embeddingService.findMostSimilar(
        queryEmbedding,
        embeddings,
        5,
        0.7
      );

      // Generate AI response
      const aiResponse = await aiService.generateResponse({
        prompt,
        context: ragResults.map((r) => ({
          content: r.content,
          metadata: r.metadata,
        })),
        conversationHistory,
        systemInstruction: context
          ? `Additional context about the user:\n${JSON.stringify(context, null, 2)}`
          : undefined,
      });

      // Save messages to conversation
      let messageId: string;
      
      if (conversation) {
        // Save user message
        await prisma.message.create({
          data: {
            conversationId: sessionId,
            role: 'user',
            content: prompt,
          },
        });

        // Save assistant message
        const assistantMessage = await prisma.message.create({
          data: {
            conversationId: sessionId,
            role: 'assistant',
            content: aiResponse.response,
            thoughtSignature: aiResponse.thoughtSignature,
          },
        });

        messageId = assistantMessage.id;
      } else {
        // Create temporary message ID
        messageId = `msg_${Date.now()}`;
      }

      res.json({
        success: true,
        messageId,
        response: aiResponse.response,
        thoughtSignature: aiResponse.thoughtSignature,
        model: aiResponse.model,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate response',
      });
    }
  }

  /**
   * POST /api/conversations
   * Start new chat session
   */
  async createConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { initialContext } = req.body;

      const conversation = await prisma.conversation.create({
        data: {
          userId,
          initialContext: initialContext || {},
        },
      });

      res.json({
        success: true,
        sessionId: conversation.id,
        createdAt: conversation.createdAt,
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create conversation',
      });
    }
  }

  /**
   * GET /api/conversations/:sessionId
   * Get conversation history
   */
  async getConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const userId = req.user?.id;

      const conversation = await prisma.conversation.findFirst({
        where: {
          id: sessionId,
          userId,
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          error: 'Conversation not found',
        });
        return;
      }

      res.json({
        success: true,
        sessionId: conversation.id,
        messages: conversation.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          thoughtSignature: msg.thoughtSignature,
          timestamp: msg.timestamp,
        })),
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversation',
      });
    }
  }

  /**
   * GET /api/conversations
   * Get user's conversations
   */
  async getUserConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const conversations = await prisma.conversation.findMany({
        where: { userId },
        include: {
          messages: {
            take: 1,
            orderBy: { timestamp: 'desc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      res.json({
        success: true,
        conversations: conversations.map((conv) => ({
          sessionId: conv.id,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          lastMessage: conv.messages[0] || null,
        })),
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversations',
      });
    }
  }

  /**
   * DELETE /api/conversations/:sessionId
   * Delete conversation
   */
  async deleteConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const userId = req.user?.id;

      await prisma.conversation.deleteMany({
        where: {
          id: sessionId,
          userId,
        },
      });

      res.json({
        success: true,
        message: 'Conversation deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete conversation',
      });
    }
  }
}

export const chatController = new ChatController();
