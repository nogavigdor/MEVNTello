
// List interface
export interface List {
  _id: string;
  name: string;
  projectId: string; // Reference to Proejct ID
  tasks: string[]; // Array of Task IDs
  createdAt?: Date;
  updatedAt?: Date;
}



