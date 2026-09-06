import { useEffect, useState, useCallback } from 'react';
import { Search, Leaf, Building2, ChevronRight, Loader2, Globe, ShieldAlert } from 'lucide-react';
import { CompanyListItem } from '../types';
import { api } from '../../utils/api';

interface SearchPageProps {
  onSelectCompany: (username: string) => void;
}

function classeColor(clase: string | null) {
  if (!clase) return 'bg-gray-100 text-gray-500';
  if (clase === 'A+' || clase === 'A') return 'bg-green-100 text-green-700';
  if (clase === 'B') return 'bg-blue-100 text-blue-700';
  if (clase === 'C') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function scoreColor(score: number | null) {
  if (score === null) return 'text-gray-400';
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-500';
}

let debounceTimer: ReturnType<typeof setTimeout>;

export function SearchPage({ onSelectCompany }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    setError(false);
    const data = await api.searchCompanies(q);
    if (data === null) setError(true);
    setResults(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    runSearch('');
  }, [runSearch]);

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(query), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, runSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 pt-10 pb-16 px-5">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-4">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold mb-1">Directorio de Sostenibilidad</h1>
          <p className="text-green-50 text-sm">
            Busca empresas registradas en EcoControl y conoce su desempeño ambiental
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 -mt-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar empresa por nombre..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-800"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <Loader2 className="w-5 h-5 animate-spin" />
            Buscando empresas...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
            <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">No se pudo conectar con el directorio</p>
            <p className="text-gray-400 text-sm">Verifica tu conexión e intenta nuevamente.</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
            <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {query ? `Ninguna empresa pública coincide con "${query}".` : 'Todavía no hay empresas públicas en el directorio.'}
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-3 pb-10">
            <p className="text-xs text-gray-400 font-medium px-1">
              {results.length} empresa{results.length !== 1 ? 's' : ''} pública{results.length !== 1 ? 's' : ''}
            </p>
            {results.map(company => (
              <button
                key={company.username}
                onClick={() => onSelectCompany(company.username)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100 hover:border-green-200 group"
              >
                                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-green-100 rounded-xl flex-shrink-0 w-11 h-11 flex items-center justify-center overflow-hidden">
                    {company.logoUrl
                      ? <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                      : <Building2 className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{company.companyName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3" />
                      {company.unitsCount} unidad{company.unitsCount !== 1 ? 'es' : ''} registrada{company.unitsCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${scoreColor(company.score)}`}>
                      {company.score ?? '—'}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${classeColor(company.clase)}`}>
                      {company.clase ?? 'Sin datos'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
