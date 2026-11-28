import { useQuery } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { getObservations } from "../services/observe.services";

export const useObservations = (pack?: string) =>
    useQuery({
        queryKey: querykey.observations.list(pack),
        queryFn: () => getObservations(pack),
    });