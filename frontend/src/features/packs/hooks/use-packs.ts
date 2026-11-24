// hooks/use-packs.ts
import { useQuery } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { getPacks } from "../services/pack.services";

export const usePacks = () =>
    useQuery({ queryKey: querykey.packs.list(), queryFn: getPacks });