
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { getSystemInstruction } from "../constants";
import { DailyHoroscope, UserProfile } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const tools = [
  {
    functionDeclarations: [
      {
        name: 'calculate_natal_chart',
        description: '計算精確星盤數據與紫微命盤',
        parameters: {
          type: Type.OBJECT,
          properties: {
            birth_time: { type: Type.STRING, description: 'ISO format birth time' },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER },
          },
          required: ['birth_time'],
        },
      },
      {
        name: 'get_lunar_calendar',
        description: '進行陰陽曆轉換，獲取農曆與節氣資訊',
        parameters: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: 'YYYY-MM-DD' },
          },
          required: ['date'],
        },
      },
    ],
  },
];

export const generateDailyHoroscope = async (profile: UserProfile): Promise<DailyHoroscope> => {
  const ai = getAI();
  const birthInfo = `${profile.name}, 生於 ${profile.birthDate} ${profile.birthTime} 於 ${profile.birthPlace}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `用戶背景：${birthInfo}。請對比今日星象，為該用戶生成今日專屬運勢報告。`,
    config: {
      systemInstruction: getSystemInstruction(profile),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          overall_score: { type: Type.INTEGER },
          lucky_color: { type: Type.STRING },
          lucky_direction: { type: Type.STRING },
          summary: { type: Type.STRING },
          action_items: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["date", "overall_score", "lucky_color", "lucky_direction", "summary", "action_items"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const startAstroChat = (profile: UserProfile): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: getSystemInstruction(profile),
      tools,
    }
  });
};

export const analyzeFace = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: "請分析這張照片中的面部特徵。請關注『三庭五眼』的比例、眉眼的形狀以及氣色。基於面相學知識，分析此人的性格優勢以及近期需要注意的運勢。請以專業命理師口吻條列呈現。" },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      }
    ],
    config: {
      systemInstruction: getSystemInstruction()
    }
  });
  return response.text;
};

export const handleFunctionCall = (name: string, args: any) => {
  if (name === 'calculate_natal_chart') {
    return {
      sun: '解析中...',
      moon: '解析中...',
      ziwei_star: '主星入命宮',
      status: 'success'
    };
  }
  if (name === 'get_lunar_calendar') {
    return {
      lunar_date: '農曆查詢成功',
      status: 'success'
    };
  }
  return { error: 'Function not found' };
};
