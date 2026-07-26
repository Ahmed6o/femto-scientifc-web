import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

const SECRET = process.env.JWT_SECRET || 'femto-admin-secret-key-123';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function verifyAuth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  if (token === 'null') throw new Error('Token is null string');
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('JWT Verification failed: ' + err.message);
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      verifyAuth(req);
    } catch (authErr) {
      return res.status(401).json({ error: 'Unauthorized: ' + authErr.message });
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const fetchRes = await fetch(url);
    const html = await fetchRes.text();
    
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header').remove();
    const pageText = $('body').text().replace(/\s+/g, ' ').trim();
    
    let mainImageUrl = $('meta[property="og:image"]').attr('content') || 
                       $('.product-image img, .main-image img, .hero img, img').first().attr('src');
                       
    if (mainImageUrl && !mainImageUrl.startsWith('http')) {
        const urlObj = new URL(url);
        mainImageUrl = new URL(mainImageUrl, urlObj.origin).href;
    }

    const prompt = `
Extract the product details from the following webpage text. Return a JSON object with this exact structure:
{
  "name": "Product Name",
  "slug": "product-name-slug",
  "category": "Category Name",
  "brand": "Brand Name",
  "excerpt": "Short tagline or description",
  "description": "Full description of the product",
  "industry": ["Industry 1", "Industry 2"],
  "specifications": [
    { "group": "Group Name (e.g. ROD or General)", "key": "Spec Key", "value": "Spec Value" }
  ]
}

Webpage text:
${pageText.substring(0, 30000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiData = JSON.parse(response.text);

    // On Vercel we cannot save to the local file system (/public/images/uploads) 
    // because it is read-only and ephemeral. We just return the direct URL.
    aiData.image = mainImageUrl || '';

    res.json(aiData);
  } catch (err) {
    console.error('Scrape API Error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
