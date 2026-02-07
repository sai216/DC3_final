# RAG + AI + Pricing API Documentation

## Overview
Complete AI-powered knowledge base, chat, and pricing system with RAG (Retrieval-Augmented Generation) capabilities using Google Gemini.

## Environment Variables Required

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Authentication
Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.  
Exceptions: `/api/health` and `/api/seed` (development only).

---

## Knowledge Base Endpoints

### 1. POST /api/knowledge/ingest
**Purpose:** Ingest documents into knowledge base with vector embeddings

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "documents": [
    {
      "type": "pdf|terms|bundle|general",
      "content": "document text content",
      "metadata": {
        "title": "Document Title",
        "category": "revenue_category",
        "version": "1.0"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "ingested": 5,
  "knowledgeBaseIds": ["kb_123", "kb_456"],
  "embeddings": {
    "model": "text-embedding-004",
    "dimensions": 768
  }
}
```

### 2. POST /api/knowledge/search
**Purpose:** Vector similarity search for RAG context retrieval

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "What are the pricing tiers for SaaS bundles?",
  "topN": 5,
  "filters": {
    "category": "saas",
    "minScore": 0.7
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "kb_123",
      "content": "Relevant text chunk...",
      "score": 0.92,
      "metadata": {"title": "SaaS Pricing Guide"}
    }
  ]
}
```

### 3. GET /api/knowledge/documents
**Purpose:** Get all documents in knowledge base

**Query Params:**
- `type`: Filter by document type
- `category`: Filter by category
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "documents": [...],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### 4. GET /api/knowledge/document/:id
**Purpose:** Get specific document by ID

### 5. DELETE /api/knowledge/document/:id
**Purpose:** Delete document from knowledge base

---

## Chat & Conversation Endpoints

### 6. POST /api/chat/generate
**Purpose:** Generate AI response with RAG context

**Request Body:**
```json
{
  "sessionId": "session_789",
  "prompt": "How should I price my SaaS product?",
  "context": {
    "revenueCategory": "saas",
    "companyScale": "startup"
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_101",
  "response": "Based on your SaaS startup profile...",
  "thoughtSignature": {
    "reasoning": "Applied SaaS pricing framework...",
    "contextUsed": ["kb_123", "kb_456"],
    "confidence": 0.89
  },
  "model": "gemini-2.0-flash-exp"
}
```

### 7. POST /api/conversations
**Purpose:** Start new chat session

**Request Body:**
```json
{
  "initialContext": {
    "businessType": "saas",
    "revenue": 500000
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_789",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

### 8. GET /api/conversations/:sessionId
**Purpose:** Fetch conversation history with thought signatures

**Response:**
```json
{
  "success": true,
  "sessionId": "session_789",
  "messages": [
    {
      "id": "msg_100",
      "role": "user",
      "content": "Help me price my product",
      "timestamp": "2026-02-01T10:00:00Z"
    },
    {
      "id": "msg_101",
      "role": "assistant",
      "content": "Based on your profile...",
      "thoughtSignature": {
        "reasoning": "...",
        "contextUsed": ["kb_123"]
      },
      "timestamp": "2026-02-01T10:00:05Z"
    }
  ]
}
```

### 9. GET /api/conversations
**Purpose:** Get all user's conversations

### 10. DELETE /api/conversations/:sessionId
**Purpose:** Delete conversation

---

## Pricing Endpoints

### 11. POST /api/pricing/calculate
**Purpose:** Compute RC + Scale + Complexity pricing

**Request Body:**
```json
{
  "bundleId": "bundle_saas_pro",
  "revenueCategory": "saas",
  "companyRevenueScale": "medium_10m",
  "complexityRating": 7
}
```

**Response:**
```json
{
  "success": true,
  "pricing": {
    "basePricing": 5000,
    "scaleMultiplier": 1.5,
    "complexityAdjustment": 1.35,
    "finalPrice": 9112.50,
    "breakdown": {
      "base": 5000,
      "scaleAdjustment": 2500,
      "complexityAdjustment": 1612.50
    }
  }
}
```

### 12. GET /api/pricing/categories
**Purpose:** Get all revenue categories

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "uuid",
      "name": "SaaS",
      "code": "saas",
      "description": "Software as a Service businesses"
    }
  ]
}
```

### 13. GET /api/pricing/scales
**Purpose:** Get all company scales

### 14. GET /api/pricing/complexity
**Purpose:** Get all complexity tiers

### 15. GET /api/pricing/base
**Purpose:** Get all base pricing configurations

---

## System Endpoints

### 16. GET /api/health
**Purpose:** Health check (no auth required)

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-01T10:00:00Z",
  "database": "connected"
}
```

### 17. POST /api/seed
**Purpose:** Seed database with initial data (no auth required)

**Request Body:**
```json
{
  "seedType": "all|categories|scales|complexity|pricing",
  "overwrite": false
}
```

**Response:**
```json
{
  "success": true,
  "seeded": ["categories", "scales", "complexity", "pricing"],
  "count": 252
}
```

**Seed Types:**
- `categories`: Revenue categories (SaaS, E-Commerce, Consulting, etc.)
- `scales`: Company scales (Pre-Revenue, Startup, Small, Medium, Large, Enterprise)
- `complexity`: Complexity tiers (1-10 rating scale)
- `pricing`: Base pricing for all bundle/category/scale combinations
- `all`: Seed everything

---

## Database Models

### KnowledgeBase
- `id`: UUID
- `documentType`: pdf | terms | bundle | general
- `content`: Full text content
- `embedding`: Vector embedding (768 dimensions)
- `metadata`: JSON metadata
- `title`, `category`, `version`

### Conversation
- `id`: UUID
- `userId`: UUID (foreign key)
- `initialContext`: JSON
- `messages`: Related messages

### Message
- `id`: UUID
- `conversationId`: UUID (foreign key)
- `role`: user | assistant | system
- `content`: Message text
- `thoughtSignature`: JSON (reasoning, contextUsed, confidence)
- `timestamp`

### RevenueCategory
- `id`: UUID
- `name`: Display name
- `code`: Unique code
- `description`: Category description

### CompanyScale
- `id`: UUID
- `name`: Display name
- `code`: Unique code
- `revenueMin`, `revenueMax`: Revenue range
- `multiplier`: Pricing multiplier

### ComplexityTier
- `id`: UUID
- `rating`: 1-10 complexity rating
- `name`: Tier name
- `adjustmentMultiplier`: Price adjustment

### BasePricing
- `id`: UUID
- `bundleId`: Bundle identifier
- `bundleName`: Bundle display name
- `revenueCategoryId`: Foreign key
- `companyScaleId`: Foreign key
- `basePrice`: Base price amount

---

## Usage Flow

### 1. Seed Database (First Time Setup)
```bash
curl -X POST http://localhost:8000/api/seed \
  -H "Content-Type: application/json" \
  -d '{"seedType": "all", "overwrite": false}'
```

### 2. Ingest Knowledge Base
```bash
curl -X POST http://localhost:8000/api/knowledge/ingest \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [{
      "type": "bundle",
      "content": "SaaS Pro Bundle includes advanced analytics, API access, and priority support. Ideal for growing companies with 10-50 employees.",
      "metadata": {
        "title": "SaaS Pro Bundle",
        "category": "saas",
        "version": "1.0"
      }
    }]
  }'
```

### 3. Start Conversation
```bash
curl -X POST http://localhost:8000/api/conversations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "initialContext": {
      "businessType": "saas",
      "revenue": 5000000
    }
  }'
```

### 4. Generate AI Response
```bash
curl -X POST http://localhost:8000/api/chat/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_xxx",
    "prompt": "What bundle would you recommend for my SaaS company with $5M revenue?",
    "context": {
      "revenueCategory": "saas",
      "companyScale": "medium_10m"
    }
  }'
```

### 5. Calculate Pricing
```bash
curl -X POST http://localhost:8000/api/pricing/calculate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "bundleId": "bundle_saas_pro",
    "revenueCategory": "saas",
    "companyRevenueScale": "medium_10m",
    "complexityRating": 6
  }'
```

---

## Key Features

### RAG (Retrieval-Augmented Generation)
- Automatic vector embedding generation
- Semantic search across knowledge base
- Context injection into AI prompts
- Confidence scoring

### Thought Signatures
- Meta-reasoning about AI responses
- Transparency into decision-making process
- Context tracking
- Confidence metrics

### Dynamic Pricing
- Multi-factor pricing calculation
- Revenue category-based pricing
- Company scale multipliers
- Complexity adjustments
- Transparent pricing breakdown

### Conversation Management
- Persistent chat sessions
- Conversation history
- Context preservation
- Multi-turn conversations

---

## Error Handling

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

All authenticated endpoints are rate-limited to prevent abuse. Default limits apply as configured in the rate limiter middleware.

---

## Complete Endpoint Summary

**Total: 17 new endpoints**

**Knowledge** (`/api/knowledge`) - 5 endpoints
- POST `/ingest` - Ingest documents with embeddings
- POST `/search` - Vector similarity search
- GET `/documents` - List all documents
- GET `/document/:id` - Get document by ID
- DELETE `/document/:id` - Delete document

**Chat** (`/api/chat` & `/api/conversations`) - 5 endpoints
- POST `/chat/generate` - Generate AI response with RAG
- POST `/conversations` - Create conversation
- GET `/conversations` - List user's conversations
- GET `/conversations/:sessionId` - Get conversation history
- DELETE `/conversations/:sessionId` - Delete conversation

**Pricing** (`/api/pricing`) - 5 endpoints
- POST `/calculate` - Calculate pricing
- GET `/categories` - Get revenue categories
- GET `/scales` - Get company scales
- GET `/complexity` - Get complexity tiers
- GET `/base` - Get all base pricing

**System** - 2 endpoints
- GET `/health` - Health check
- POST `/seed` - Seed database

---

**Grand Total: 39 API Endpoints** across the entire backend system!
