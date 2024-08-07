export type TaskTemplateList = {
  _id: string;
  name: string;
  tasks: {
    _id: string;
    name: string;
    description: string;
  }[];
};

// Task Template interface to enable creating auto task templates for projects
export interface TaskTemplate {
  _id: string;
  name: string;
  lists: TaskTemplateList[];
  createdAt?: Date;
  updatedAt?: Date;
}
