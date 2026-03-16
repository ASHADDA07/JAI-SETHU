import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    // Initializes OpenAI with the key from your .env file
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateDraft(docType: string, clientName: string, opposingParty: string, facts: string) {
    try {
      const systemPrompt = `
        You are a Senior Advocate practicing in the Supreme Court of India.
        You are an expert in Indian Jurisprudence, including the IPC, CrPC, CPC, and the new BNS laws.
        Your task is to draft a highly professional, legally binding document.

        CRITICAL RULES:
        1. Tone: Formal, authoritative, and strictly adhering to Indian legal formatting.
        2. Formatting: You MUST output the response in pure, clean HTML. Do NOT use markdown code blocks (like \`\`\`html). Just raw HTML.
        3. Allowed HTML tags: <h1>, <h2>, <h3>, <p>, <strong>, <em>, <u>, <ol>, <ul>, <li>, <br>.
        4. Always center the court name or main heading using <h2 class="ql-align-center"><strong>HEADING</strong></h2>.
        5. Never include filler words like "Here is the draft." Start immediately with the court name or notice heading.
      `;

      const userPrompt = `
        Draft a: ${docType}
        Client Name: ${clientName}
        Opposing Party: ${opposingParty}
        Case Facts / Context: ${facts}
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast, cheap, and very smart
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2, // Keeps the AI highly factual and less "creative"
      });

      // Strip out any accidental markdown formatting the AI tries to sneak in
      let htmlContent = response.choices[0].message.content || '';
      htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '').trim();

      return { draft: htmlContent };

    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new InternalServerErrorException('Failed to generate legal draft.');
    }
  }
}