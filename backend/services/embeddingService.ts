import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
}

class EmbeddingService {
  private model: string;

  constructor() {
    this.model = 'text-embedding-004';
  }

  /**
   * Generate embeddings for a single text
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const model = genAI.getGenerativeModel({ model: this.model });
      
      const result = await model.embedContent(text);
      const embedding = result.embedding;

      return {
        embedding: embedding.values,
        dimensions: embedding.values.length,
      };
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      const embeddings = await Promise.all(
        texts.map((text) => this.generateEmbedding(text))
      );
      return embeddings;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error('Failed to generate batch embeddings');
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return similarity;
  }

  /**
   * Find most similar embeddings
   */
  findMostSimilar(
    queryEmbedding: number[],
    embeddings: Array<{ id: string; embedding: number[]; content: string; metadata?: any }>,
    topN: number = 5,
    minScore: number = 0.7
  ): Array<{ id: string; content: string; score: number; metadata?: any }> {
    const similarities = embeddings.map((item) => ({
      id: item.id,
      content: item.content,
      metadata: item.metadata,
      score: this.cosineSimilarity(queryEmbedding, item.embedding),
    }));

    // Filter by minimum score and sort by score descending
    const filtered = similarities
      .filter((item) => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return filtered;
  }
}

export const embeddingService = new EmbeddingService();
