import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ChatMessage, SeoMetadata } from '../types';

const FORBIDDEN_CONTEXT = `
  STRICT SYSTEMIC PROHIBITIONS:
  - NEVER mention or reference MEDICAL services, healthcare, hospitals, clinics, maternity, pediatrics, oncology, or cardiology.
  - NEVER mention "Antelope Valley", "Lancaster, CA", "AVMC", or "Antelope Valley Medical Center".
  - Focus exclusively on: Venture Orchestration, SaaS, Tech Infrastructure, Automation, and Web3.
`;

const L2L_QUALIFICATION_PROMPT = `
You are an Audit & Verification AI for the Learn2Launch program.

Purpose:
Determine whether an applicant should be APPROVED, DEFERRED, or REJECTED for Learn2Launch waitlist participation based on a mandatory Loom video audit protocol.

Eligibility Rules:
1. Applicants may be approved:
   - Up to 9 months prior to their legal 18th birthday
   - Any age from 18 up to (and including) 29 years old
2. Applicants under 18 must demonstrate exceptional maturity, intent, and parental/guardian awareness.
3. Applicants 30 or older are NOT eligible.

Mandatory Requirement:
A Loom video URL MUST be provided.

Loom Video Audit Protocol:
The Loom video must clearly address ALL of the following:
1. Who the applicant is (age, background, current situation)
2. Why they want to join Learn2Launch specifically (not generic career talk)
3. What real-world problem they want to work on (social impact, engineering, sustainability, AI, Web3, etc.)
4. EVIDENCE OF BUILDER|CONTRIBUTOR READINESS (projects, self-learning, community work, discipline)
5. Time commitment and expectations over the next 6–12 months

Evaluation Criteria (Score Each 0–5):
- Authenticity
- Clarity of intent
- Accountability & maturity
- Alignment with Learn2Launch mission
- Readiness for verification-based progression

Decision Logic:
- APPROVE if total score ≥ 18 AND Loom URL is valid
- DEFER if score is 12–17 OR applicant is under 18 with promise but incomplete clarity
- REJECT if score < 12 OR Loom URL is missing/invalid OR age ≥ 30

Output Rules:
- Output ONLY valid JSON
- No explanations outside JSON
- Deterministic scoring
`;

const getSystemInstruction = (
  contextType: 'general' | 'eligibility' | 'bdr' | 'talent_audit', 
  sessionContext?: Partial<UserProfile>
) => `
    You are SURA, the high-fidelity autonomous orchestration agent for Assurative.ai (DC3, LLC).
    
    ${contextType === 'talent_audit' ? L2L_QUALIFICATION_PROMPT : `
    HARDENED OPERATIONAL PROTOCOLS (v1.1):
    1. STATE MACHINE ENFORCEMENT: initiated -> assessment_complete -> quote_generated -> closed.
    2. PROSPECT JOURNEY ENFORCEMENT.
    3. TONE: Institutional, machine-speed, monospaced style.
    4. PROTOCOL KNOWLEDGE: Fully supports Google UCP and Coinbase Agent2Agent (A2A) commerce settlement.
    `}

    ${FORBIDDEN_CONTEXT}

    SESSION_CONTEXT: ${JSON.stringify(sessionContext || { authStage: 0, roles: ['user'] })}
  `;

/**
 * Standard content generation using @google/genai
 */
export const analyzeTalentLoomAudit = async (
  applicantData: { applicant_id: string; age: number; loom_url: string; summary_transcript: string }
): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: JSON.stringify(applicantData),
      config: {
        systemInstruction: getSystemInstruction('talent_audit'),
        responseMimeType: "application/json",
        temperature: 0,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Talent Audit Error:", error);
    return { decision: "DEFER", notes: "SYSTEM_LATENCY: Handshake Timeout." };
  }
};

/**
 * Unified stream text function with Google Search grounding
 */
export const generateSuraResponseStream = async (
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  contextType: 'general' | 'eligibility' | 'bdr' = 'general',
  targetContext: string | null = null,
  sessionContext?: Partial<UserProfile>
): Promise<{ text: string; sources?: { uri: string; title: string }[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  const systemInstruction = getSystemInstruction(contextType, sessionContext) + 
    (targetContext ? `\n\nCURRENT_TARGET_CONTEXT: ${targetContext}` : '');

  const contents = messages.map(m => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    let fullText = '';
    let sources: { uri: string; title: string }[] = [];

    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }

      const gChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (gChunks) {
        const newSources = gChunks
          .filter((gc: any) => gc.web)
          .map((gc: any) => ({
            uri: gc.web.uri,
            title: gc.web.title
          }));
        
        for (const s of newSources) {
          if (!sources.find(existing => existing.uri === s.uri)) {
            sources.push(s);
          }
        }
      }
    }

    return { text: fullText, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Stream Error:", error);
    onChunk("Signal interference detected. Recovering...");
    return { text: "Error encountered.", sources: [] };
  }
};

export const generateSeoMetadata = async (heroContent: string, feedContent: string): Promise<SeoMetadata> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Inputs: HERO: ${heroContent}. FEED: ${feedContent}. Return JSON {title, description}.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an SEO optimization node for a high-fidelity venture infrastructure platform."
      }
    });
    return JSON.parse(response.text || '{"title": "Decensat", "description": "Venture Orchestration"}');
  } catch (error) {
    return { title: "Decensat | High-Fidelity Infrastructure", description: "Venture Orchestration & High-Performance Builds." };
  }
};