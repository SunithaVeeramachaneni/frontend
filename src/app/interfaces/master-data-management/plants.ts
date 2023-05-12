export interface GetPlants {
  searchTerm?: FilterInput;
}
export interface CreatePlants {
  name: string;
  plantId: string;
  country: string;
  zipCode: string;
  state?: string;
  image?: string;
  searchTerm?: string;
}

export interface DeletePlants {
  id: string;
  _version: number;
}

export type PlantsResponse = {
  items: Array<{
    image?: string;
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
