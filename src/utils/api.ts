import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { CompanyListItem, CompanyProfile } from '../app/types';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3deff245`;
const HEADERS = {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json',
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export const api = {
  searchCompanies: (query: string) =>
    get<CompanyListItem[]>(`/public/companies${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCompanyProfile: (username: string) =>
    get<CompanyProfile>(`/public/companies/${encodeURIComponent(username)}`),

  askQuestion: async (username: string, question: string, askerName: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE}/public/companies/${encodeURIComponent(username)}/questions`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ question, askerName }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
