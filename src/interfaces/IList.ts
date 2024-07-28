
// List interface
export interface IList {
  _id: string;
  name: string;
  projectId: string; // Reference to Proejct ID
  tasks: string[]; // Array of Task IDs
  createdAt?: Date;
  updatedAt?: Date;
}



