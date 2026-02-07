import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { embeddingService } from '../services/embeddingService';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

class KnowledgeController {
  /**
   * POST /api/knowledge/ingest
   * Ingest documents into knowledge base with embeddings
   */
  async ingestDocuments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { documents } = req.body;

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        res.status(400).json({
          success: false,
          error: 'documents array is required',
        });
        return;
      }

      const knowledgeBaseIds: string[] = [];

      // Process each document
      for (const doc of documents) {
        const { type, content, metadata } = doc;

        if (!type || !content) {
          continue; // Skip invalid documents
        }

        // Generate embedding for the content
        const { embedding } = await embeddingService.generateEmbedding(content);

        // Store in database
        const kb = await prisma.knowledgeBase.create({
          data: {
            documentType: type,
            content,
            embedding: embedding, // Store as JSON array
            metadata: metadata || {},
            title: metadata?.title,
            category: metadata?.category,
            version: metadata?.version,
          },
        });

        knowledgeBaseIds.push(kb.id);
      }

      res.json({
        success: true,
        ingested: knowledgeBaseIds.length,
        knowledgeBaseIds,
        embeddings: {
          model: 'text-embedding-004',
          dimensions: 768,
        },
      });
    } catch (error) {
      console.error('Error ingesting documents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to ingest documents',
      });
    }
  }

  /**
   * POST /api/knowledge/search
   * Vector similarity search for RAG context retrieval
   */
  async searchKnowledge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { query, topN = 5, filters } = req.body;

      if (!query) {
        res.status(400).json({
          success: false,
          error: 'query is required',
        });
        return;
      }

      // Generate embedding for the query
      const { embedding: queryEmbedding } = await embeddingService.generateEmbedding(query);

      // Fetch all knowledge base entries (with optional filters)
      const where: any = {};
      
      if (filters?.category) {
        where.category = filters.category;
      }

      const kbEntries = await prisma.knowledgeBase.findMany({
        where,
      });

      // Calculate similarities
      const embeddings = kbEntries
        .filter((entry) => entry.embedding)
        .map((entry) => ({
          id: entry.id,
          embedding: entry.embedding as any as number[],
          content: entry.content,
          metadata: entry.metadata,
        }));

      const minScore = filters?.minScore || 0.7;
      const results = embeddingService.findMostSimilar(
        queryEmbedding,
        embeddings,
        topN,
        minScore
      );

      res.json({
        success: true,
        results: results.map((r) => ({
          id: r.id,
          content: r.content,
          score: r.score,
          metadata: r.metadata,
        })),
      });
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search knowledge base',
      });
    }
  }

  /**
   * GET /api/knowledge/documents
   * Get all documents in knowledge base
   */
  async getDocuments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, category, limit = 50, offset = 0 } = req.query;

      const where: any = {};
      
      if (type) {
        where.documentType = type;
      }
      
      if (category) {
        where.category = category;
      }

      const documents = await prisma.knowledgeBase.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          documentType: true,
          title: true,
          category: true,
          version: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          // Exclude content and embedding from list view
        },
      });

      const total = await prisma.knowledgeBase.count({ where });

      res.json({
        success: true,
        documents,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
        },
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch documents',
      });
    }
  }

  /**
   * GET /api/knowledge/document/:id
   * Get specific document by ID
   */
  async getDocumentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const document = await prisma.knowledgeBase.findUnique({
        where: { id },
      });

      if (!document) {
        res.status(404).json({
          success: false,
          error: 'Document not found',
        });
        return;
      }

      res.json({
        success: true,
        document: {
          ...document,
          // Optionally exclude embedding from response
          embedding: undefined,
        },
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document',
      });
    }
  }

  /**
   * DELETE /api/knowledge/document/:id
   * Delete document from knowledge base
   */
  async deleteDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.knowledgeBase.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document',
      });
    }
  }
}

export const knowledgeController = new KnowledgeController();
