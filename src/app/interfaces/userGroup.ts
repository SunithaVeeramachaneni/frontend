import { Column } from "@innovapptive.com/dynamictable/lib/interfaces";

export interface UserGroup{
name:string;
description?:string;
plantId:string;
}
export interface UserGroupDetails{
  name:string;
  description?:string;
  plantId:string;
  createdBy?:string;
  updatedAt?:string;
  user?:string;
  searchTerm?:string;
}




