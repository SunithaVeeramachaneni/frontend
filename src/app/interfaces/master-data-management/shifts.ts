export interface GetShifts {
  searchTerm?: FilterInput;
}
export interface CreateShifts {
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  searchTerm?: string;
}

export type ShiftsResponse = {
  items: Array<{
    createdAt: string;
  } | null>;
  next?: string;
};

export interface FilterInput {
  ne?: string;
  eq?: string;
  le?: string;
  lt?: string;
  ge?: string;
  gt?: string;
  contains?: string;
  notContains?: string;
}
