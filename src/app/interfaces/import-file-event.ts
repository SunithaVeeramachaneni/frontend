export interface ImportFileEventData {
  message: string;
  progress: number;
  fileName?: string;
  transcription?: string;
  wiName?: string; 
  id?: string;
  isError?: boolean;
}