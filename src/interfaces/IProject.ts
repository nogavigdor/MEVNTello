import { TeamMember } from './ITeamMember';

export interface Project {
  _id?: string;  // new projects won't have an ID until they are created in the database
  creationStatus: 'tasks' | 'management' | 'complete';
  selectedTemplate?: string;  // Task Template ID
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allocatedHours: number;
  creator: string;  // User ID
  teamMembers: TeamMember[];
  lists?: string[];  // Optional for when creating a new project, it's not needed
  createdAt?: Date;
  updatedAt?: Date;
}