import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateText, generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Nur POST-Anfragen für die Generierung erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Bitte nutze einen POST-Request.' });
  }

  try {
    const { thema, zielgruppe } = req.body;

    if (!thema) {
      return res.status(400).json({ error: 'Bitte gib ein "thema" im Request-Body an.' });
    }

    const zielgruppenFokus = zielgruppe || 'Allgemeines Fachpublikum';

    // 1. Keyword-Recherche via Gemini (Strukturiertes JSON-Objekt)
    const { object: keywordResult } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        keywords: z.array(z.string()).describe('Die 5 wichtigsten SEO-Keywords für das Thema.'),
        suchintention: z.string().describe('Kurze Analyse der Suchintention.')
      }),
      prompt: `Analysiere das Thema "${thema}" für die Zielgruppe "${zielgruppenFokus}". Generiere die 5 suchstärksten deutschen SEO-Keywords für einen Blogbeitrag.`,
    });

    const keywords = keywordResult.keywords;

    // 2. Textgenerierung basierend auf den ermittelten Keywords
    const { text: blogPost } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Schreibe einen umfassenden, SEO-optimierten Blogpost auf Deutsch.
      
      Thema: ${thema}
      Zielgruppe: ${zielgruppenFokus}
      Pflicht-Keywords (natürlich einbauen): ${keywords.join(', ')}
      Suchintention: ${keywordResult.suchintention}
      
      Nutze sauberes Markdown (H1 für den Titel, H2 und H3 für Zwischenüberschriften). Beginne direkt mit der H1.`,
    });

    // Ergebnisse zurückgeben
    return res.status(200).json({
      success: true,
      thema,
      analysierteKeywords: keywords,
      blogPost: blogPost
    });

  } catch (error: any) {
    console.error('Fehler:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}