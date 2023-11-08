export interface SHRColumnConfiguration {
  columnId: string;
  columnName: string;
  selected: boolean;
  content?: SHRColumnConfiguration[];
}
