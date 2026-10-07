"use client";

import { useEffect, useState } from "react";
import { fetchInterviewQuestions, InterviewQuestion } from "@/lib/api";

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviewQuestions()
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Interview Preparation</h1>
        <p className="text-xl text-muted-foreground">Master technical interviews with our curated question bank.</p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading questions...</p>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-center text-muted-foreground">No questions available yet.</p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="border rounded-xl bg-card overflow-hidden transition-all shadow-sm hover:shadow-md">
                <button 
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{q.title}</span>
                    <span className="text-sm text-muted-foreground mt-1">{q.questionContent}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getDifficultyColor(q.difficultyLevel)}`}>
                      {q.difficultyLevel}
                    </span>
                    <span className="text-2xl">{expandedId === q.id ? '−' : '+'}</span>
                  </div>
                </button>
                
                {expandedId === q.id && (
                  <div className="p-6 border-t bg-muted/20">
                    <h4 className="font-semibold mb-2">Answer:</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {q.answerContent}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
