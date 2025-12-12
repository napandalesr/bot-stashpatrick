export interface ImageProcessingOptions {
  denoise?: boolean;
  enhanceContrast?: boolean;
  grayscale?: boolean;
  threshold?: number;
  scale?: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
  imagePath?: string;
  processingTime: number;
}