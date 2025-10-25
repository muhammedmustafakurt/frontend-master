"use server";
import { cookies } from 'next/headers';

async function getAuthHeadersMultipart() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    Authorization: `Bearer ${token}`,
  } as Record<string, string>;
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
}

export interface UploadImageResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(formData: FormData): Promise<{ success: boolean; data?: UploadImageResult; error?: string }> {
  try {
    const headers = await getAuthHeadersMultipart();
    const response = await fetch(`${getApiUrl()}/upload/image`, {
      method: 'POST',
      // Let fetch set proper multipart boundaries
      headers,
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      let message = 'Failed to upload image';
      try {
        const err = await response.json();
        message = err.message || message;
      } catch {}
      return { success: false, error: message };
    }

    const data = (await response.json()) as UploadImageResult;
    return { success: true, data };
  } catch (error) {
    console.error('Upload image error:', error);
    return { success: false, error: 'Network error occurred' };
  }
}


