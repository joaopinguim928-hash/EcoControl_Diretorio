import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, Award, Building2, Target, TrendingDown, Loader2, ShieldAlert,
  Droplets, Zap, Recycle, Factory, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { CompanyProfile } from '../types';
import { api } from '../../utils/api';

interface CompanyProfilePageProps {
  username: string;
  onBack: () => void;
}

function scoreTextColor(score: number) {
  return score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';
}
function scoreStroke(score: number) {
  return score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
}

export function CompanyProfilePage({ username, onBack }: CompanyProfilePageProps) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    api.getCompanyProfile(username).then(data => {
      if (!active) return;
      if (!data) setNotFound(true);
      else setProfile(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [username]);

  const BackButton = () => (
    <button
      onClick={onBack}
      className="mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium">Volver al directorio</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Cargando perfil...
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-sm">
            <ShieldAlert className="w-9 h-9 text-amber-500 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold mb-1">Perfil no disponible</p>
            <p className="text-gray-400 text-sm">Esta empresa no existe o no ha hecho público su perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasScore = profile.score !== null;
  const circumference = 2 * Math.PI * 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-5xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <Building2 className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.companyName}</h1>
            <p className="text-gray-500 text-sm">
              {profile.unitsCount} unidad{profile.unitsCount !== 1 ? 'es' : ''} registrada{profile.unitsCount !== 1 ? 's' : ''} · Perfil público
            </p>
          </div>
        </div>

        {!hasScore && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm mb-6">
            <p className="text-gray-500">Esta empresa aún no cargó datos ambientales.</p>
          </div>
        )}

        {hasScore && (
          <>
            {/* Score gauge */}
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-xl border-2 border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="inline-block relative">
                  <svg className="w-44 h-44" viewBox="0 0 176 176">
                    <circle cx="88" cy="88" r="80" stroke="#e5e7eb" strokeWidth="11" fill="none" />
                    <circle
                      cx="88" cy="88" r="80"
                      stroke={scoreStroke(profile.score!)}
                      strokeWidth="11" fill="none"
                      strokeDasharray={`${(profile.score! / 100) * circumference} ${circumference}`}
                      strokeLinecap="round" transform="rotate(-90 88 88)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${scoreTextColor(profile.score!)}`}>{profile.score}</span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Puntuación Ambiental ESG</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Clasificación: Clase {profile.clase}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-fit mx-auto md:mx-0">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {profile.emReduction >= 0 ? '-' : '+'}{Math.abs(profile.emReduction)}% de emisiones en el período
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 mb-6">
              {profile.breakdown.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm">{item.categoria}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">Peso: {item.peso}%</span>
                    </div>
                    <span className={`font-bold ${scoreTextColor(item.score)}`}>{item.score}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${item.score >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : item.score >= 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Per-unit scores, if more than one unit */}
            {profile.units.length > 1 && (
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Puntuación por unidad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {profile.units.map(u => (
                    <div key={u.id} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className={`text-2xl font-bold ${scoreTextColor(u.score)}`}>{u.score}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{u.name}</div>
                      <div className="text-xs text-gray-400">Clase {u.clase}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {profile.chart.co2.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg"><Factory className="w-4 h-4 text-blue-600" /></div>
                    <h3 className="font-semibold text-gray-800 text-sm">Emisiones de CO₂ (agregado)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={profile.chart.co2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="limite" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" name="Límite" dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2.5} name="Emisiones (tCO2e)" dot={{ r: 3 }} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {profile.chart.agua.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-cyan-100 p-2 rounded-lg"><Droplets className="w-4 h-4 text-cyan-600" /></div>
                    <h3 className="font-semibold text-gray-800 text-sm">Consumo de Agua (agregado)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={profile.chart.agua}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="consumo" stroke="#0891b2" strokeWidth={2.5} name="Consumo (m³)" dot={{ r: 3 }} isAnimationActive={false} />
                      <Line type="monotone" dataKey="reutilizada" stroke="#10b981" strokeWidth={2} name="Reutilizada (m³)" dot={{ r: 3 }} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {profile.chart.energia.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-yellow-100 p-2 rounded-lg"><Zap className="w-4 h-4 text-yellow-600" /></div>
                    <h3 className="font-semibold text-gray-800 text-sm">Energía (agregado)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={profile.chart.energia} barGap={4} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="renovavel" fill="#10b981" name="Renovable (MWh)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="naoRenovavel" fill="#f97316" name="No Renovable (MWh)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {profile.chart.residuos.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg"><Recycle className="w-4 h-4 text-green-600" /></div>
                    <h3 className="font-semibold text-gray-800 text-sm">Residuos Sólidos (agregado)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={profile.chart.residuos} barGap={4} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="produzido" fill="#94a3b8" name="Producido (ton)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="reciclado" fill="#10b981" name="Reciclado (ton)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}

        {/* Public sustainability targets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Metas de Sostenibilidad</h3>
          </div>

          {profile.targets.length === 0 && (
            <p className="text-gray-400 text-sm">Esta empresa aún no publicó metas de sostenibilidad.</p>
          )}

          <div className="space-y-4">
            {profile.targets.map(target => {
              const range = target.inicio - target.meta;
              const progress = range > 0
                ? Math.min(Math.max(((target.inicio - target.atual) / range) * 100, 0), 100)
                : 100;
              const isOnTarget = target.atual <= target.meta;
              return (
                <div key={target.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{target.nome}</h4>
                    <div className="flex items-center gap-1.5">
                      {isOnTarget
                        ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                        : <AlertCircle className="w-4 h-4 text-yellow-600" />}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isOnTarget ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isOnTarget ? 'En curso' : 'Atención'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{target.inicio.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Baseline</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-sm font-bold text-blue-600">{target.atual.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Actual</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-sm font-bold text-green-600">{target.meta.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Meta</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Progreso: {Math.round(progress)}%</span>
                    <span className="text-xs text-gray-400">
                      {target.prazo ? new Date(target.prazo).toLocaleDateString('es-ES') : '—'}
                      {target.unidade && <span className="ml-2">· {target.unidade}</span>}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
