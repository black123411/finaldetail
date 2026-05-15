import { GoogleGenAI, Type } from "@google/genai";
import { SERVICES } from '@/shared/data/services';
import { RecommendationResult } from '@/shared/types';
import { getGeminiKey } from "../lib/config";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const key = getGeminiKey() || (process.env.GEMINI_API_KEY as string);
    if (!key) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

export async function analyzeVehicleImage(base64Image: string): Promise<RecommendationResult> {
  const model = "gemini-flash-latest";
  
  const ai = getAI();
  const systemInstruction = `
    You are an expert auto detailer assistant for Bryan's Showroom Quality Detailing.
    Analyze the provided vehicle image and identify its condition and visible issues.
    
    Vehicle Conditions:
    - Light: Minor dust, light surface dirt, well-maintained.
    - Moderate: Noticeable dirt, light swirls, some interior clutter or light staining.
    - Severe: Heavy oxidation, deep scratches, major interior stains, mold, or neglected paint.

    SERVICES LIST:
    ${SERVICES.map(s => `- ${s.name} (ID: ${s.id}, Category: ${s.categoryId}, Description: ${s.shortDescription})`).join("\n")}
    
    Mapping Rules:
    1. If condition is "Light", prioritize: "Full Detail (Level 1: Essential)", "Interior Detail (Level 1: Refresh)", or "Maintenance Wash (Bi-Weekly)".
    2. If condition is "Moderate", prioritize: "Full Detail (Level 2: Advanced Reset)", "Interior Detail (Level 2: Deep Restore)", or "Exterior Detail (Level 1: Protect & Guard)".
    3. If condition is "Severe", prioritize: "Full Detail (Level 3: Showroom Restore)", "Interior Detail (Level 3: Deep Restoration)", or "Paint Correction (Level 3: Stage 2)".

    Upsell Opportunities:
    - Based on visible issues, suggest 2-3 additional specific services or add-on items from the list.
    - If paint has swirls/scratches, suggest "Paint Correction".
    - If paint is dull, suggest "Ceramic Coating".
    - If interior seats are stained, suggest "Interior Detail".
    - If wheels are heavily brake-dusted, suggest "Wheel Barrel Clean".

    Output valid JSON only according to the schema provided.
    Provide a clear, brief explanation (reasoning) for why the specific service is recommended based on the user's vehicle condition.
    Be decisive and professional.
  `;

  const prompt = "Analyze this vehicle image. Determine if the condition is Light, Moderate, or Severe. Identify visible issues and recommend the most effective service, give a reasoning for why this service was chosen for this condition, and provide potential upsells.";

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      vehicle_condition: { type: Type.STRING, description: "Light | Moderate | Severe" },
      confidence: { type: Type.NUMBER },
      visible_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommended_service: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          id: { type: Type.STRING, description: "The ID of the service from the provided list" },
          reasoning: { type: Type.STRING, description: "Detailed explanation of why this specific service is the best fit for the vehicle's condition." }
        },
        required: ["name", "id", "reasoning"]
      },
      estimated_price_range: {
        type: Type.OBJECT,
        properties: {
          min: { type: Type.NUMBER },
          max: { type: Type.NUMBER }
        }
      },
      upsell_recommendations: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    },
    required: ["vehicle_condition", "recommended_service", "upsell_recommendations"]
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(",")[1] || base64Image } }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const data = JSON.parse(result.text);

    // Map Gemini's recommended ID back to our defined services
    let matchedService = SERVICES.find(s => s.id === data.recommended_service.id);
    
    if (!matchedService) {
      // Fallback to name search if ID didn't match perfectly
      matchedService = SERVICES.find(s => 
        s.name.toLowerCase().includes(data.recommended_service.name.toLowerCase()) ||
        data.recommended_service.name.toLowerCase().includes(s.name.toLowerCase())
      ) || SERVICES.find(s => s.id === "advanced-full")!;
    }

    const prices = Object.values(matchedService.price);
    const serviceMin = Math.min(...prices);
    const serviceMax = Math.max(...prices);

    return {
      condition: data.vehicle_condition as any,
      service: {
        name: matchedService.name,
        reasoning: data.recommended_service.reasoning,
        priceRange: {
          min: Math.max(data.estimated_price_range?.min || serviceMin, serviceMin),
          max: Math.min(data.estimated_price_range?.max || serviceMax, serviceMax)
        }
      },
      visibleIssues: data.visible_issues,
      upsellOptions: data.upsell_recommendations.map((up: any) => `${up.name}: ${up.reason}`),
      confidence: data.confidence
    };
  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    
    // Check for quota/billing errors
    if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("prepayment credits")) {
      const quotaError = new Error("QUOTA_EXHAUSTED");
      (quotaError as any).originalError = error;
      throw quotaError;
    }
    
    throw error;
  }
}
