import sharp from 'sharp';
import { createWorker, type Worker } from 'tesseract.js';

//Worker lifecycle
let workerP: Promise<Worker> | null = null;
let jobsProcessed = 0;
const MAX_JOBS_BEFORE_RESET = 500;

async function preloadWorker(langs = 'tha+eng') {
  if (!workerP) {
    workerP = createWorker(langs);
  }
  return workerP;
}

async function closeWorker() {
  if (workerP) {
    const w = await workerP;
    await w.terminate();
    workerP = null;
    jobsProcessed = 0;
  }
}

async function getWorker(langs = 'tha+eng') {
  if (!workerP) await preloadWorker(langs);
  if (jobsProcessed >= MAX_JOBS_BEFORE_RESET) {
    await closeWorker();
    await preloadWorker(langs);
  }
  return workerP!;
}

export interface OcrTransaction {
  bank: string;
  amount: string | null;
  date: string | null;
  time: string | null;
  ref: string | null;
  rawText: string;
}

export async function ocrSlip(buffer: Buffer): Promise<OcrTransaction> {
  const processed = await sharp(buffer)
    .resize(2400, null, { withoutEnlargement: true })
    .grayscale()
    .normalise()
    .median(1)
    .sharpen({ sigma: 1, m1: 0.5, m2: 2 })
    .threshold(128)
    .toFormat('png')
    .toBuffer();

  const worker = await getWorker();
  const result = await worker.recognize(processed);
  jobsProcessed++;

  const rawText = result.data.text;
  const text = rawText.replace(/\s+/g, ' ').trim();

  // ปรับปรุงการดึงจำนวนเงิน - แม่นยำสูงสุด
  function extractAmount(text: string): string | null {
    const patterns = [
      // จำนวนเงินที่มีบริบท
      /(?:จำนวน|amount|รวม|total|ยอด|เงิน)[\s:]*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)(?:\s|$|บาท)/gi,
      // รูปแบบมาตรฐาน 1,234.56
      /(\d{1,3}(?:,\d{3})*\.\d{2})/g,
      // รูปแบบไม่มีทศนิยม 1,234
      /(\d{1,3}(?:,\d{3})+)/g,
      // รูปแบบเลขธรรมดา 1234.56
      /(\d{3,}\.\d{2})/g,
      // รูปแบบไม่มีคอมมา แต่มีทศนิยม
      /(\d{4,}\.\d{2})/g,
    ];

    const candidates: { value: number; text: string; score: number }[] = [];

    for (let i = 0; i < patterns.length; i++) {
      const matches = [...text.matchAll(patterns[i])];

      for (const match of matches) {
        const amountText = match[1];
        const numericValue = parseFloat(amountText.replace(/,/g, ''));

        if (numericValue >= 0.01 && numericValue <= 99999999) {
          let score = 10 - i; // pattern แรกได้คะแนนสูงสุด

          // เพิ่มคะแนนตามบริบท
          const context = match[0].toLowerCase();
          if (
            context.includes('จำนวน') ||
            context.includes('amount') ||
            context.includes('รวม') ||
            context.includes('total')
          ) {
            score += 5;
          }

          // เพิ่มคะแนนถ้ามีทศนิยม 2 ตำแหน่ง
          if (
            amountText.includes('.') &&
            amountText.split('.')[1]?.length === 2
          ) {
            score += 3;
          }

          // เพิ่มคะแนนถ้ามีคอมมา
          if (amountText.includes(',')) {
            score += 2;
          }

          // ลดคะแนนสำหรับค่าที่น่าจะเป็นปีหรือเวลา
          if (numericValue > 1900 && numericValue < 2100) score -= 3;
          if (numericValue <= 31 && !amountText.includes('.')) score -= 2;

          candidates.push({ value: numericValue, text: amountText, score });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].text.replace(/,/g, '') : null;
  }

  // ปรับปรุงการดึงวันที่ - แม่นยำสูงสุด
  function extractDate(text: string): string | null {
    const patterns = [
      // รูปแบบไทยปี 4 หลัก (พ.ศ.)
      /(\d{1,2}\s*(?:ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(?:25|26)\d{2})/gi,
      // รูปแบบไทยปี 2 หลัก
      /(\d{1,2}\s*(?:ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*\d{2})/gi,
      // รูปแบบเต็มไทย
      /(\d{1,2}\s*(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s*(?:25|26|20)\d{2})/gi,
      // รูปแบบ DD/MM/YYYY
      /(\d{1,2}\/\d{1,2}\/(?:20|25|26)\d{2})/g,
      // รูปแบบ DD-MM-YYYY
      /(\d{1,2}-\d{1,2}-(?:20|25|26)\d{2})/g,
    ];

    const candidates: { text: string; score: number }[] = [];

    for (let i = 0; i < patterns.length; i++) {
      const matches = [...text.matchAll(patterns[i])];

      for (const match of matches) {
        const dateText = match[1];
        let score = 10 - i;

        // ตรวจสอบความถูกต้องของวันที่
        if (dateText.includes('/') || dateText.includes('-')) {
          const parts = dateText.split(/[/-]/);
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);

          if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
            score += 3;
          } else {
            score -= 5;
          }
        }

        // เพิ่มคะแนนสำหรับปี พ.ศ.
        if (dateText.match(/25\d{2}|26\d{2}/)) {
          score += 3;
        }

        // เพิ่มคะแนนสำหรับรูปแบบไทย
        if (dateText.includes('ม.ค.') || dateText.includes('มกราคม')) {
          score += 2;
        }

        candidates.push({ text: dateText, score });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].text : null;
  }

  // ปรับปรุงการดึงเวลา - แม่นยำสูงสุด
  function extractTime(text: string): string | null {
    const patterns = [
      // รูปแบบมาตรฐาน HH:MM พร้อมบริบท
      /(?:เวลา|time|at)[\s:]*(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)/gi,
      // รูปแบบ HH:MM:SS
      /(\d{1,2}[:.]\d{2}[:.]\d{2})/g,
      // รูปแบบ HH:MM
      /(\d{1,2}[:.]\d{2})/g,
      // รูปแบบ HH.MM
      /(\d{1,2}\.\d{2})/g,
    ];

    const candidates: { text: string; score: number }[] = [];

    for (let i = 0; i < patterns.length; i++) {
      const matches = [...text.matchAll(patterns[i])];

      for (const match of matches) {
        let timeText = match[1] || match[0];
        let score = 10 - i;

        // ทำให้เป็นรูปแบบมาตรฐาน HH:MM
        timeText = timeText.replace(/\./g, ':');

        // ตรวจสอบความถูกต้องของเวลา
        const timeParts = timeText.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          score += 5;

          // เพิ่มคะแนนถ้ามีบริบท
          const context = match[0].toLowerCase();
          if (context.includes('เวลา') || context.includes('time')) {
            score += 3;
          }

          // เพิ่มคะแนนถ้าเป็นเวลาในช่วงที่สมเหตุสมผล
          if (hours >= 6 && hours <= 22) {
            score += 2;
          }

          // ลดคะแนนถ้าเป็นตัวเลขที่น่าจะเป็นอย่างอื่น
          if (hours > 24 || minutes > 59) {
            score -= 10;
          }

          // ลดคะแนนถ้าดูเหมือนจำนวนเงิน
          if (
            timeText.includes('.') &&
            timeParts.length === 2 &&
            parseInt(timeParts[1]) < 10
          ) {
            score -= 3;
          }

          candidates.push({ text: timeText, score });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].text : null;
  }

  // ปรับปรุงการจดจำธนาคาร
  function detectBank(text: string): string {
    const bankPatterns = [
      { code: 'KTB', patterns: ['กรุงไทย', 'KTB', 'Krung Thai'] },
      { code: 'SCB', patterns: ['SCB', 'ไทยพาณิชย์', 'Siam Commercial'] },
      { code: 'KBANK', patterns: ['กสิกร', 'KBank', 'KASIKORN', 'K-Bank'] },
      { code: 'BBL', patterns: ['กรุงเทพ', 'BBL', 'Bangkok Bank'] },
      { code: 'TMB', patterns: ['ทีเอ็มบี', 'TMB', 'ทหารไทย'] },
      { code: 'BAY', patterns: ['กรุงศรี', 'BAY', 'Krungsri'] },
      { code: 'UOB', patterns: ['ยูโอบี', 'UOB'] },
      { code: 'GSB', patterns: ['ออมสิน', 'GSB'] },
    ];

    for (const bank of bankPatterns) {
      for (const pattern of bank.patterns) {
        if (text.includes(pattern)) {
          return bank.code;
        }
      }
    }
    return 'UNKNOWN';
  }

  const refMatch = text.match(/(รหัส|เลขที่รายการ|Ref)[^\d]*(\d{6,})/i);

  return {
    bank: detectBank(text),
    amount: extractAmount(text),
    date: extractDate(text),
    time: extractTime(text),
    ref: refMatch?.[2] ?? null,
    rawText: text,
  };
}
