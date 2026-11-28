import { useMutation, useQueryClient } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { prepareImage } from "../../../lib/image";
import { createObservation, getUploadUrl, uploadToS3 } from "../services/observe.services";
import type { CreateObservationInput } from "../types";

export function useCreateObservation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ photo, ...fields }: CreateObservationInput) => {
            const blob = await prepareImage(photo); // resize + strip EXIF
            const { uploadUrl, key } = await getUploadUrl(blob.type, blob.size);

            try {
                await uploadToS3(uploadUrl, blob);
            } catch {
                throw new Error("Image upload failed. Please check your connection and try again.");
            }

            return createObservation({ ...fields, imageKey: key });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: querykey.observations.all }),
    });
}