export interface GetPlants {
  searchTerm?: FilterInput;
}

export interface PlantTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: PlantDetails;
}

export interface PlantDetails {
  id: string;
  name: string;
  plantId: string;
  country: string;
  zipCode: string;
  timeZone: {
    utcOffset: string;
    timeZoneIdentifier: string;
    description: string;
  };
  countryDisplay?: string;
  timeZoneDisplay?: string;
  field?: string;
  label?: string;
  state?: string;
  image?: string;
  searchTerm?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlants {
  name: string;
  plantId: string;
  country: string;
  zipCode: string;
  timeZone: {
    utcOffset: string;
    timeZone: string;
    description: string;
  };
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
