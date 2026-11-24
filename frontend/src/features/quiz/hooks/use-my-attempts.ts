import { useQuery } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { getMyAttempts } from "../services/quiz.services";

export const useMyAttempts = () =>
    useQuery({ queryKey: querykey.attempts.mine(), queryFn: getMyAttempts });