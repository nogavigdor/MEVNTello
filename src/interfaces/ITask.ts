import { AssignedMember } from './IAssignedMember';
import SubTask from './ISubTask';
//Interface for the tast object
export interface Task {
    _id: string;
    listId: string;
    name: string;
    description: string;
    assignedMembers: AssignedMember[]; // Array of User IDs
    hoursAllocated: number;
    hoursUsed: number;
    status: 'todo' | 'inProgress' | 'done';
    subTasks: SubTask[];
    createdAt?: Date;
    updatedAt?: Date;
} 

export type NewTask = Omit<Task, "_id">;