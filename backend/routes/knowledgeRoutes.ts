import { Router } from 'express';
import { knowledgeController } from '../controllers/knowledgeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All routes require authentication except search (can be public)
router.use(authenticateToken);

/**
 * Ingest documents into knowledge base
 * POST /api/knowledge/ingest
 * Body: { documents: [{ type, content, metadata }] }
 */
router.post('/ingest', authRateLimiter, knowledgeController.ingestDocuments);

/**
 * Vector similarity search
 * POST /api/knowledge/search
 * Body: { query, topN?, filters? }
 */
router.post('/search', knowledgeController.searchKnowledge);

/**
 * Get all documents
 * GET /api/knowledge/documents
 * Query: type?, category?, limit?, offset?
 */
router.get('/documents', knowledgeController.getDocuments);

/**
 * Get document by ID
 * GET /api/knowledge/document/:id
 */
router.get('/document/:id', knowledgeController.getDocumentById);

/**
 * Delete document
 * DELETE /api/knowledge/document/:id
 */
router.delete('/document/:id', knowledgeController.deleteDocument);

export default router;
