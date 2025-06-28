// 2. Types (src/types/dashboard.types.ts)
export interface DriscScore {
  score: number;
  tripsConsidered?: number;
  trips_considered?: number;
}

export interface RiskLevel {
  level: string;
  color: string;
  gradient: string[];
  icon: string;
}

export interface RiskFactor {
  name: string;
  status: string;
  color: string;
  icon: string;
}
