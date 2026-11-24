import { Link } from "react-router";

import { Badge } from "../../../components/ui/badge";
import { buttonVariants } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import type { Attempt } from "../types";

export function ResultView({ attempt }: { attempt: Attempt }) {
    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
            <Card>
                <CardHeader className="items-center text-center">
                    <p className="text-sm text-muted-foreground">{attempt.pack.name} quiz completed</p>
                    <CardTitle className="text-4xl">
                        {attempt.score} / {attempt.maxScore}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {attempt.answeredCount} of {attempt.totalQuestions} questions answered
                    </p>
                </CardHeader>
                <CardContent className="flex justify-center">
                    {/* Change "/" if your dashboard lives on another path */}
                    <Link to="/" className={buttonVariants({ variant: "outline" })}>
                        Back to dashboard
                    </Link>
                </CardContent>
            </Card>

            {attempt.questions.map((q, i) => {
                const a = q.answer;
                const skipped = !a || a.selectedOptionId === null;

                return (
                    <Card key={q.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                                <CardTitle className="text-base leading-snug">
                                    {i + 1}. {q.text}
                                </CardTitle>
                                {skipped ? (
                                    <Badge variant="secondary">Not answered · 0</Badge>
                                ) : (
                                    <Badge variant={a.isCorrect ? "default" : "destructive"}>
                                        {a.isCorrect ? `+${a.pointsAwarded}` : "0"}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-2">
                            {q.options.map((o) => {
                                const isCorrect = o.id === a?.correctOptionId;
                                const isSelected = o.id === a?.selectedOptionId;
                                const cls = isCorrect
                                    ? "border-green-600 bg-green-600/10"
                                    : isSelected
                                      ? "border-destructive bg-destructive/10"
                                      : "opacity-60";

                                return (
                                    <div key={o.id} className={`rounded-lg border p-3 text-sm ${cls}`}>
                                        {o.text}
                                        {isCorrect && <span className="ml-2 text-xs font-medium">✓ Correct answer</span>}
                                        {isSelected && !isCorrect && (
                                            <span className="ml-2 text-xs font-medium">Your answer</span>
                                        )}
                                    </div>
                                );
                            })}

                            {a?.explanation && (
                                <p className="mt-1 text-sm text-muted-foreground">{a.explanation}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}