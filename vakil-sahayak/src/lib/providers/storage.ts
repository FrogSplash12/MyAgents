import { getSupabase } from "../persistence/supabase";

const BUCKET = "documents";

/**
 * Upload a file to Supabase Storage.
 * Returns the storage path (not a public URL).
 */
export async function uploadFile(
  path: string,
  file: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const { error } = await getSupabase().storage
    .from(BUCKET)
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`uploadFile failed: ${error.message}`);
  return path;
}

/**
 * Generate a signed URL for temporary access to a stored file.
 */
export async function getSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const { data, error } = await getSupabase().storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw new Error(`getSignedUrl failed: ${error.message}`);
  return data.signedUrl;
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await getSupabase().storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw new Error(`deleteFile failed: ${error.message}`);
}
