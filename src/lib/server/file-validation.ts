import { error } from '@sveltejs/kit';

const ALLOWED_AUDIO = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aiff'];
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_ZIP = ['application/zip', 'application/x-zip-compressed'];

type FileCategory = 'audio' | 'image' | 'zip';

const MAGIC_SIGNATURES: Record<FileCategory, number[][]> = {
  audio: [
    [0xff, 0xfb], // MP3
    [0xff, 0xf3], // MP3
    [0xff, 0xf2], // MP3
    [0x49, 0x44, 0x33], // ID3 (MP3 with tags)
    [0x52, 0x49, 0x46, 0x46], // RIFF (WAV)
  ],
  image: [
    [0xff, 0xd8, 0xff], // JPEG
    [0x89, 0x50, 0x4e, 0x47], // PNG
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP)
  ],
  zip: [
    [0x50, 0x4b, 0x03, 0x04], // ZIP
  ],
};

export async function validateFile(
  buffer: Buffer,
  declaredType: string,
  category: FileCategory
): Promise<void> {
  const allowedTypes: Record<FileCategory, string[]> = {
    audio: ALLOWED_AUDIO,
    image: ALLOWED_IMAGE,
    zip: ALLOWED_ZIP,
  };

  if (!allowedTypes[category].includes(declaredType)) {
    throw error(400, `Tipo de archivo no permitido: ${declaredType}`);
  }

  const magic = buffer.subarray(0, 4);
  const signatures = MAGIC_SIGNATURES[category];

  const isValid = signatures.some(sig =>
    sig.every((byte, i) => magic[i] === byte)
  );

  if (!isValid) {
    throw error(400, `Archivo inválido. Solo se permiten archivos ${category} reales.`);
  }
}

export function getMaxSize(category: FileCategory): number {
  const sizes: Record<FileCategory, number> = {
    audio: 500 * 1024 * 1024, // 500MB
    image: 10 * 1024 * 1024,  // 10MB
    zip: 200 * 1024 * 1024,   // 200MB
  };
  return sizes[category];
}
