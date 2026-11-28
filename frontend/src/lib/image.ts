const MAX_SIDE = 1600;

/** This resizes the photo and re-encodes it as JPEG, which also strips EXIF data, including GPS. That's the privacy protection for the kids' photos. */
export async function prepareImage(file: File): Promise<Blob> {
    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file); // applies the camera's rotation
    } catch {
        throw new Error("Could not read this image. Try a JPEG or PNG photo.");
    }

    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image");

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return new Promise((resolve, reject) =>
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))),
            "image/jpeg",
            0.85
        )
    );
}