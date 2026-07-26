import multer from 'multer';
import jwt from 'jsonwebtoken';
import { supabase } from './_supabase.js';

const SECRET = process.env.JWT_SECRET || 'femto-admin-secret-key-123';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

function verifyAuth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token === 'null') throw new Error('No token provided');
  return jwt.verify(token, SECRET);
}

// Vercel specific config to disable default body parser so multer can handle the stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    verifyAuth(req);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }

  try {
    // Parse the multipart form data
    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Try uploading to Supabase Storage first
    if (supabase) {
      const fileName = `uploads/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path);
        return res.json({ url: urlData.publicUrl });
      } else {
        console.warn('Supabase storage upload failed, falling back to base64. Error:', error);
      }
    }

    // Fallback: Convert to Base64 Data URL if Supabase bucket doesn't exist or fails
    const b64 = req.file.buffer.toString('base64');
    const url = `data:${req.file.mimetype};base64,${b64}`;
    res.json({ url });

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
