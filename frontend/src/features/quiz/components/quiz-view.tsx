import { useSearchParams } from "react-router";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";

import { useFinishAttempt, useSubmitAnswer } from "../hooks/use-attempt";
import type { Attempt } from "../types";

export function QuizView({ attempt }: { attempt: Attempt }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const submit = useSubmitAnswer(attempt.id);
    const finish = useFinishAttempt(attempt.id);

    const { questions } = attempt;
    const total = questions.length;

    // Current question comes from ?q= (1-based); default is the first unanswered one
    const firstUnanswered = questions.findIndex((q) => !q.answer);
    const fromUrl = Number(searchParams.get("q")) - 1;
    const index =
        Number.isInteger(fromUrl) && fromUrl >= 0 && fromUrl < total
            ? fromUrl
            : firstUnanswered === -1
              ? total - 1
              : firstUnanswered;

    const question = questions[index]!;
    const answer = question.answer;
    const unansweredCount = total - attempt.answeredCount;
    const isLast = index === total - 1;

    const goTo = (i: number) => {
        submit.reset();
        setSearchParams({ q: String(i + 1) }, { replace: true });
    };

    const handleFinish = () => {
        if (
            unansweredCount > 0 &&
            !window.confirm(`${unansweredCount} question(s) are unanswered and will score 0. Finish anyway?`)
        ) {
            return;
        }
        finish.mutate();
    };

    const optionClass = (optionId: string) => {
        const base = "w-full rounded-lg border p-3 text-left text-sm transition";
        if (!answer) return `${base} hover:bg-muted disabled:opacity-60`;
        if (optionId === answer.correctOptionId) return `${base} border-green-600 bg-green-600/10`;
        if (optionId === answer.selectedOptionId) return `${base} border-destructive bg-destructive/10`;
        return `${base} opacity-60`;
    };

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {attempt.pack.name} · Question {index + 1} of {total}
                </span>
                <Badge variant="secondary">Score: {attempt.score}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                    <Button
                        key={q.id}
                        size="sm"
                        className="size-8 p-0"
                        variant={i === index ? "default" : q.answer ? "secondary" : "outline"}
                        onClick={() => goTo(i)}
                        aria-label={`Go to question ${i + 1}`}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg leading-snug">{question.text}</CardTitle>
                    {question.terrain && <Badge variant="outline" className="w-fit">{question.terrain.name}</Badge>}
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                    {question.options.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className={optionClass(option.id)}
                            disabled={!!answer || submit.isPending}
                            onClick={() => submit.mutate({ questionId: question.id, optionId: option.id })}
                        >
                            {option.text}
                        </button>
                    ))}

                    {answer && (
                        <div className="mt-2 rounded-lg bg-muted p-3 text-sm">
                            <p className="font-medium">
                                {answer.isCorrect ? `Correct! +${answer.pointsAwarded} points` : "Not quite."}
                            </p>
                            {answer.explanation && (
                                <p className="mt-1 text-muted-foreground">{answer.explanation}</p>
                            )}
                        </div>
                    )}

                    {submit.isError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submit.error.message}</AlertDescription>
                        </Alert>
                    )}
                    {finish.isError && (
                        <Alert variant="destructive">
                            <AlertDescription>{finish.error.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="justify-between">
                    <Button variant="outline" disabled={index === 0} onClick={() => goTo(index - 1)}>
                        Previous
                    </Button>

                    {isLast ? (
                        <Button disabled={finish.isPending} onClick={handleFinish}>
                            {finish.isPending ? "Finishing…" : "Finish quiz"}
                        </Button>
                    ) : (
                        <Button onClick={() => goTo(index + 1)}>Next</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}