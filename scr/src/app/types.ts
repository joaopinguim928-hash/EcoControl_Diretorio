export type CompanyListItem = {
  username: string;
  companyName: string;
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

export type CompanyProfile = {
  username: string;
  companyName: string;
  unitsCount: number;
  score: number | null;
  clase: string | null;
  emReduction: number;
  breakdown: ScoreBreakdownItem[];
  chart: {
