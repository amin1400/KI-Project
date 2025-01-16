export interface EmployeeData {
  id: string;
  budgetAdherence: number;
  communityComm: number;
  verticalComm: number;
  projectCompletionRate: number;
  workQuality: number;
  cluster?: number;
  predictedPerformance?: number;
}

export interface ClusterMetrics {
  centroid: number[];
  strength: string[];
  weakness: string[];
  recommendedTraining: string[];
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Training {
  name: string;
  description: string;
  forMetrics: string[];
}

export interface EmployeeMetrics {
  strengths: string[];
  weaknesses: string[];
  recommendedTrainings: Training[];
  predictedPerformance: number;
}