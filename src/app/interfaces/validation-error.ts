export interface ValidationError {
  [key: string]:
    | { name: string; length: number }
    | { [key: string]: { name: string; length: number } }
    | any;
}
