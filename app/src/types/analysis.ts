export interface AnalysisResult {
  urgeDetection: {
    score: number;
    description: string;
    details: string[];
  };
  violenceUrge: {
    score: number;
    description: string;
    details: string[];
  };
  finalVerdict: {
    isDangerous: boolean;
    requiresAttention: boolean;
    title: string;
    description: string;
  };
}

export interface AnalysisProgress {
  currentStep: number;
  step1Result: number;
  step2Result: number;
  overallProgress: number;
}
