export interface Category {
  Category_Id: string;
  Category_Name: string;
  Cover_Image: string;
  Created_At?: string;
  Updated_At?: string;
}

export interface CategoryOptional {
  CId: string;
  Category_Name: string;
  Cover_Image: string;
  Created_At?: string;
  Updated_At?: string;
}

export interface CategoryObject {
  [key: string]: Category;
}
