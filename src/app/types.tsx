export type CompanyListItem = {
  username: string;
  companyName: string;
  logoUrl: string | null;
  unitsCount: number;
  score: number | null;
  clase: string | null;
};

export type ScoreBreakdownItem = {
  categoria: string;
  score: number;
  peso: number;
};

export type ChartRow = Record<string, string | number>;

export type UnitScore = {
  id: string;
  name: string;
  score: number;
  clase: string;
};

export type PublicTarget = {
  id: string;
  nome: string;
  meta: number;
  atual: number;
  inicio: number;
  unidade: string;
  prazo: string;
};

export type CompanyPost = {
  id: string;
  text: string;
  createdAt: string;
};

export type CompanyQuestion = {
  id: string;
  question: string;
  askerName: string;
  askedAt: string;
  answer: string | null;
  answeredAt: string | null;
};

export type CompanyProfile = {
  username: string;
  companyName: string;
  description: string;
  logoUrl: string | null;
  unitsCount: number;
  score: number | null;
  clase: string | null;
  emReduction: number;
  breakdown: ScoreBreakdownItem[];
  chart: {
    co2: ChartRow[];
    agua: ChartRow[];
    energia: ChartRow[];
    residuos: ChartRow[];
    emissoes: ChartRow[];
  };
  units: UnitScore[];
  targets: PublicTarget[];
  posts: CompanyPost[];
  questions: CompanyQuestion[];
};
