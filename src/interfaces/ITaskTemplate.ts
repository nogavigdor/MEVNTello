// Task Template interface to enable creating auto task templates for projects
export interface TaskTemplate {
  _id: string;
  name: string;
  lists: {
    name: string;
    tasks: {
      name: string;
      description: string;
    }[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
