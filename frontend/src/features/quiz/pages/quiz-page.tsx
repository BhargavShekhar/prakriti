import { useParams } from "react-router";
import { useAttempt } from "../hooks/use-attempt";
import { QuizView } from "../components/quiz-view";
import { ResultView } from "../components/result-view";

export function QuizPage() {
    const { attemptId = "" } = useParams();
    const { data: attempt, isPending, isError, error } = useAttempt(attemptId);

    if (isPending) return <p className="p-6 text-sm text-muted-foreground">Loading quiz…</p>;
    if (isError) return <p className="p-6 text-sm text-destructive">{error.message}</p>;

    return attempt.status === "FINISHED" ? (
        <ResultView attempt={attempt} />
    ) : (
        <QuizView attempt={attempt} />
    );
}