import { QuizState, RecommendationResult, VehicleType, ServiceDetail } from '@/shared/types';
import { SERVICES } from "../constants";

export function getQuizRecommendation(state: QuizState): RecommendationResult {
  let score = 0;

  // Interior: 1-4
  score += state.interiorCondition;

  // Exterior: 1-4
  score += state.exteriorCondition;

  // Issues: length
  score += state.problemAreas.length;

  // Goal
  if (state.goal === "Full restoration") score += 2;
  if (state.goal === "Long-term protection") score += 3;

  let recommendedId: string;
  let condition: "Light" | "Moderate" | "Severe";

  if (score <= 4) {
    recommendedId = "maint-plan";
    condition = "Light";
  } else if (score <= 7) {
    recommendedId = "pkg-full";
    condition = "Moderate";
  } else if (score <= 10) {
    recommendedId = "pkg-showroom";
    condition = "Moderate";
  } else {
    recommendedId = "pkg-protection";
    condition = "Severe";
  }

  const service = SERVICES.find(s => s.id === recommendedId)!;

  return {
    condition,
    service: {
      name: service.name,
      squareServiceId: service.squareId,
      priceRange: {
        min: service.priceMin,
        max: service.priceMax
      }
    },
    visibleIssues: state.problemAreas
  };
}

export function mapGeminiServiceToLocal(geminiRecommendedName: string): ServiceDetail {
  // Simple fuzzy match or exact match
  const match = SERVICES.find(s => 
    s.name.toLowerCase().includes(geminiRecommendedName.toLowerCase()) || 
    geminiRecommendedName.toLowerCase().includes(s.name.toLowerCase())
  );
  return match || SERVICES.find(s => s.id === "pkg-full")!;
}
