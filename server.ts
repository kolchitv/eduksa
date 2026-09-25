import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "lughati-saudi-platform" });
  });

  // Arabic Text-To-Speech (TTS) Proxy with in-memory caching
  const ttsCache = new Map<string, Buffer>();
  const MAX_TTS_CACHE_ITEMS = 600;

  app.get("/api/tts", async (req, res) => {
    try {
      const rawText = typeof req.query.text === 'string' ? req.query.text.trim() : '';
      if (!rawText) {
        return res.status(400).json({ error: "Missing text query parameter" });
      }

      // Limit length per request chunk
      const cleanText = rawText.slice(0, 350);
      const cacheKey = `ar_${cleanText}`;

      // Return cached audio if present
      if (ttsCache.has(cacheKey)) {
        const cached = ttsCache.get(cacheKey)!;
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
        res.setHeader("Content-Length", cached.length.toString());
        return res.send(cached);
      }

      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      const response = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/",
          "Accept": "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: "TTS provider unavailable" });
      }

      const arrayBuf = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      if (buffer.length === 0) {
        return res.status(502).json({ error: "Empty audio buffer received" });
      }

      // Evict oldest item if cache limit reached
      if (ttsCache.size >= MAX_TTS_CACHE_ITEMS) {
        const oldestKey = ttsCache.keys().next().value;
        if (oldestKey) ttsCache.delete(oldestKey);
      }
      ttsCache.set(cacheKey, buffer);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
      res.setHeader("Content-Length", buffer.length.toString());
      return res.send(buffer);
    } catch (err: any) {
      console.error("TTS Proxy error:", err);
      return res.status(500).json({ error: "Internal TTS server error", details: err?.message });
    }
  });

  // AI Tutor & Grammar Assistant
  app.post("/api/ai/tutor-chat", async (req, res) => {
    try {
      const { message, grade, topic } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          reply: `مرحباً بك يا بطل! أنا معلمك الذكي لمقرر لغتي الجميلة (${grade || "المرحلة الابتدائية"}). بخصوص سؤالك عن "${message}"، تذكّر دائماً مراجعة القاعدة والتدرب على قراءة الكلمات بالحركات، وإذا كان لديك سؤال محدد في الإعراب أو الإملاء فسأساعدك خطوة بخطوة!`,
          isFallback: true,
        });
      }

      const prompt = `أنت معلم خبير ولطيف لمادة "لغتي الجميلة" في المنهاج السعودي للمرحلة الابتدائية (${grade || "جميع الصفوف"}).
الموضوع الحالي: ${topic || "مهارات وقواعد لغتي"}
سؤال الطالب أو المعلم: ${message}

أجب باللغة العربية الفصحى السلسة المناسبة لطلاب المرحلة الابتدائية في المملكة العربية السعودية:
- استخدم أسلوباً مشجعاً ومحفزاً (يا بطل / يا بطلة / بارك الله فيك).
- اشرح القاعدة بوضوح مع أمثلة مضبوطة بالشكل التام (الحركات).
- بسّط المصطلحات النحوية والإملائية.
- نسّق إجابتك بنقاط واضحة.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({
        reply: response.text || "أحسنت السؤال! حاول مراجعة القاعدة مجدداً وتطبيقها على أمثلة من كتاب لغتي.",
        isFallback: false,
      });
    } catch (err: any) {
      console.error("AI Tutor Error:", err);
      res.status(500).json({
        error: "فشل في التواصل مع المساعد الذكي",
        details: err?.message,
      });
    }
  });

  // Sentence Parsing (الإعراب والتحليل النحوي والإملائي)
  app.post("/api/ai/analyze-sentence", async (req, res) => {
    try {
      const { sentence, grade } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          diacritized: sentence,
          irab: [
            { word: sentence.split(" ")[0] || "الكلمة", role: "مبتدأ / فعل", detail: "حسب الموقع الإعرابي في المنهاج السعودي" },
          ],
          spellingRules: ["مراجعة الحركات والهمزات وفق كتاب لغتي."],
          isFallback: true,
        });
      }

      const prompt = `أنت خبير لغة عربية وإعراب لمنهاج لغتي السعودي للصف ${grade || "الابتدائي"}.
قم بتحليل الجملة التالية: "${sentence}"
أخرج النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "diacritized": "الجملة مضبوطة تماماً بالشكل والحركات التامة",
  "explanation": "شرح مبسط وممتع لمعنى الجملة ومكوناتها النحوية",
  "irab": [
    {
      "word": "الكلمة",
      "role": "الموقع الإعرابي (مثال: مبتدأ مرفوع، فاعل مرفوع، فعل ماضٍ)",
      "detail": "العلامة الإعرابية والسبب (مثال: وعلامة رفعه الضمة الظاهرة على آخره)"
    }
  ],
  "spellingPhenomena": [
    {
      "word": "الكلمة التي فيها ظاهرة",
      "rule": "اسم الظاهرة (مثال: همزة وصل، لام شمسية، مد بالألف، تاء مربوطة)",
      "explanation": "سبب كتابتها بهذه الصورة"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      res.status(500).json({ error: "فشل التحليل الإعرابي" });
    }
  });

  // AI Dynamic Quiz Generator
  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { grade, topic, count = 3 } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          questions: [
            {
              id: "q_sample_1",
              question: "ما نوع اللام في كلمة (الشَّمْس)؟",
              options: ["لام شمسية", "لام قمرية", "لام أصلية", "حرف جر"],
              correctIndex: 0,
              explanation: "اللام شمسية لأن الحرف الذي بعدها مشدد ولا تُنطق اللام.",
            },
          ],
        });
      }

      const prompt = `قم بإنشاء ${count} أسئلة اختيار من متعدد تفاعلية لمنهاج "لغتي الجميلة" السعودي للصف: "${grade}" في موضوع: "${topic}".
يجب أن تكون الأسئلة مضبوطة بالشكل ومناسبة للمرحلة العمرية.
أخرج JSON فقط:
{
  "questions": [
    {
      "id": "string",
      "question": "نص السؤال مع الحركات",
      "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
      "correctIndex": 0,
      "explanation": "شرح توضيحي ومبسط لسبب صحة الإجابة"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || '{"questions":[]}');
      res.json(parsed);
    } catch (err: any) {
      console.error("AI Quiz Error:", err);
      res.status(500).json({ error: "فشل توليد الاختبار" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lughati Saudi Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
