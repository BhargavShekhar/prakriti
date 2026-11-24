export type AttemptStatus = "IN_PROGRESS" | "FINISHED";

export interface QuestionAnswer {
    selectedOptionId: string | null;
    isCorrect: boolean;
    pointsAwarded: number;
    correctOptionId: string | null;
    explanation: string | null;
}

export interface AttemptQuestion {
    id: string;
    text: string;
    points: number;
    sortOrder: number;
    terrain: { id: string; name: string; slug: string } | null;
    options: { id: string; text: string }[];
    answer: QuestionAnswer | null;
}

export interface Attempt {
    id: string;
    status: AttemptStatus;
    score: number;
    maxScore: number;
    totalQuestions: number;
    answeredCount: number;
    pack: { slug: string; name: string };
    questions: AttemptQuestion[];
}

export interface MyAttempt {
    attemptId: string;
    packSlug: string;
    status: AttemptStatus;
    score: number;
}

export interface SubmitAnswerResult {
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string | null;
    pointsAwarded: number;
    score: number;
}