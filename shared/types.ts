export enum VehicleType {
  Car = "Car",
  SUV = "SUV",
  Truck = "Truck",
  LargeSUV = "Large SUV"
}

export interface SyncLog {
  id?: string;
  serviceId: string;
  action: 'create' | 'update' | 'delete' | 'correct';
  status: 'success' | 'failed';
  error?: string;
  squareResponse?: any;
  timestamp: any;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: Record<string, number>;
  features: string[];
  duration: string;
  badge?: string;
  active: boolean;
  squareId?: string;
  squareVersion?: number;
  syncStatus?: 'pending' | 'synced' | 'mismatch';
}

export interface RecommendedService {
  name: string;
  squareServiceId?: string;
  priceRange: {
    min: number;
    max: number;
  };
  reasoning?: string;
}

export interface RecommendationResult {
  condition: "Light" | "Moderate" | "Severe";
  service: RecommendedService;
  visibleIssues?: string[];
  confidence?: number;
  upsellOptions?: string[];
}

export interface QuizState {
  vehicleType: VehicleType;
  interiorCondition: number; // 1-4
  exteriorCondition: number; // 1-4
  problemAreas: string[];
  goal: "Basic cleanup" | "Improve appearance" | "Full restoration" | "Long-term protection";
}

export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  squareId: string;
  category: "Interior" | "Exterior" | "Paint" | "Ceramic" | "Package" | "Maintenance";
  popular?: boolean;
}
