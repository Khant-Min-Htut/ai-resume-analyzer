'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, Resume, JobDescription, ResumeAnalysis } from '@/lib/api';
import ResumeUpload from '@/components/resume-upload';
import JobDescriptionForm from '@/components/job-description-form';
import AnalysisDashboard from '@/components/analysis-dashboard';
import { LogOut, Loader2, FileText, BarChart3, History } from 'lucide-react';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [createdJobDescription, setCreatedJobDescription] = useState<JobDescription | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const handleUpload = async (file: File) => {
    const uploadedResume = await api.uploadResume(file);
    setUploadedResume(uploadedResume);
    setAnalysis(null);
    setError(null);
  };

  const handleJobDescriptionSubmit = async (data: { title: string; company: string; description: string }) => {
    const jobDescription = await api.createJobDescription(data);
    setCreatedJobDescription(jobDescription);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedResume) return;

    setAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await api.analyzeResume({
        resumeId: uploadedResume.id,
        jobDescriptionId: createdJobDescription?.id,
      });
      setAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header with user info and logout */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                AI Resume Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Upload your resume and job description to get AI-powered feedback
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/analyses')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Upload Resume
              </h2>
              <ResumeUpload onUpload={handleUpload} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Job Description
              </h2>
              <JobDescriptionForm onSubmit={handleJobDescriptionSubmit} />
            </div>
          </div>

          {uploadedResume && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Resume Upload Successful
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">File Name:</span> {uploadedResume.fileName}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">File Size:</span> {(uploadedResume.fileMetadata.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {createdJobDescription && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Job Description:</span> {createdJobDescription.title} at {createdJobDescription.company}
                  </p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Error</h3>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          )}

          {analysis && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Analysis Results
              </h2>
              <AnalysisDashboard analysis={analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
