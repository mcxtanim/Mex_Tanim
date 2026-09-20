const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'nc5hyaab';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (PNG, JPG, WEBP).');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorMsg = 'Upload failed';
    try {
      const errData = await res.json();
      errorMsg = errData.error?.message || errorMsg;
    } catch {
      errorMsg = await res.text();
    }
    throw new Error(`Cloudinary error: ${errorMsg}`);
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a secure image URL.');
  }

  console.log('✓ Successfully uploaded to Cloudinary CDN:', data.secure_url);
  return data.secure_url;
}
