'use client';

import {
  Target,
  Shield,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  LayoutList,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ScoreCard from '@/components/score-card';
import type { ResumeAnalysis } from '@/lib/api';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
}

const sectionIcons: Record<string, string> = {
  summary: '📝',
  experience: '💼',
  education: '🎓',
  skills: '🛠️',
  format: '📐',
};

export default function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ScoreCard
          label="Overall Score"
          score={analysis.overallScore}
          icon={Target}
          color="blue"
        />
        <ScoreCard
          label="ATS Score"
          score={analysis.atsScore}
          icon={Shield}
          color="green"
        />
        {analysis.jobMatchScore !== null && (
          <ScoreCard
            label="Job Match"
            score={analysis.jobMatchScore}
            icon={Briefcase}
            color="purple"
          />
        )}
      </div>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreBar label="Overall Quality" score={analysis.overallScore} />
          <ScoreBar label="ATS Compatibility" score={analysis.atsScore} />
          {analysis.jobMatchScore !== null && (
            <ScoreBar label="Job Match" score={analysis.jobMatchScore} />
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-muted-foreground" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              Skills Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {skill}
                </Badge>
              ))}
              {analysis.skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="w-5 h-5 text-rose-500" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800">
                  {skill}
                </Badge>
              ))}
              {analysis.missingSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">No missing skills</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowRight className="w-5 h-5 text-emerald-500" />
              Matched Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.map((kw, i) => (
                <Badge key={i} variant="outline" className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  {kw}
                </Badge>
              ))}
              {analysis.matchedKeywords.length === 0 && (
                <p className="text-sm text-muted-foreground">No matched keywords</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="w-5 h-5 text-rose-500" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((kw, i) => (
                <Badge key={i} variant="outline" className="border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300">
                  {kw}
                </Badge>
              ))}
              {analysis.missingKeywords.length === 0 && (
                <p className="text-sm text-muted-foreground">No missing keywords</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Feedback */}
      {analysis.sectionFeedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutList className="w-5 h-5 text-muted-foreground" />
              Section Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.entries(analysis.sectionFeedback) as [string, string | undefined][]).map(
              ([section, feedback]) =>
                feedback && (
                  <div key={section} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm">{sectionIcons[section] || '📄'}</span>
                      <h4 className="text-sm font-semibold capitalize">{section}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {feedback}
                    </p>
                  </div>
                )
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
            <Lightbulb className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Internal sub-component ── */

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{score}/100</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}
