'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, type ResumeAnalysis } from '@/lib/api';
import {
  Loader2,
  ArrowLeft,
  FileText,
  Briefcase,
  Calendar,
  Target,
  Shield,
  TrendingUp,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

function resolveResumeFileName(resumeId: ResumeAnalysis['resumeId']): string {
  if (typeof resumeId === 'object' && resumeId !== null && 'fileName' in resumeId) {
    return resumeId.fileName;
  }
  return 'Unknown Resume';
}

function resolveJobInfo(jobDescriptionId: ResumeAnalysis['jobDescriptionId']): { title: string; company: string } | null {
  if (typeof jobDescriptionId === 'object' && jobDescriptionId !== null && 'title' in jobDescriptionId) {
    return { title: jobDescriptionId.title, company: jobDescriptionId.company };
  }
  return null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20';
  if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20';
  return 'bg-rose-50 dark:bg-rose-900/20';
}

export default function AnalysisHistoryPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchAnalyses() {
      try {
        const data = await api.getAllAnalyses();
        setAnalyses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analyses');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading || (!user && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  Analysis History
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''} total
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors self-start sm:self-auto"
            >
              Logout
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Analyses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && analyses.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Analyses Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload a resume and run your first analysis to see results here.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go to Analyzer
              </button>
            </div>
          )}

          {/* Analysis list */}
          {!loading && !error && analyses.length > 0 && (
            <div className="space-y-4">
              {analyses.map((analysis) => {
                const fileName = resolveResumeFileName(analysis.resumeId);
                const jobInfo = resolveJobInfo(analysis.jobDescriptionId);

                return (
                  <button
                    key={analysis.id}
                    onClick={() => router.push(`/analyses/${analysis.id}`)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-800 p-4 sm:p-6 transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-semibold text-gray-900 dark:text-white truncate">
                            {fileName}
                          </span>
                        </div>

                        {jobInfo ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {jobInfo.title} at {jobInfo.company}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                            No job description
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(analysis.createdAt)}
                        </div>
                      </div>

                      {/* Right: score chips */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                        <ScoreChip
                          icon={<Target className="w-3.5 h-3.5" />}
                          label="Overall"
                          score={analysis.overallScore}
                        />
                        <ScoreChip
                          icon={<Shield className="w-3.5 h-3.5" />}
                          label="ATS"
                          score={analysis.atsScore}
                        />
                        {analysis.jobMatchScore !== null && (
                          <ScoreChip
                            icon={<TrendingUp className="w-3.5 h-3.5" />}
                            label="Match"
                            score={analysis.jobMatchScore}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreChip({
  icon,
  label,
  score,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${getScoreBg(score)} ${getScoreColor(score)}`}>
      {icon}
      <span>{score}</span>
      <span className="text-xs opacity-60 hidden sm:inline">{label}</span>
    </div>
  );
}
