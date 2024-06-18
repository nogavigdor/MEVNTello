import { TeamMember } from './ITeamMember';

export interface Project {
  _id: string;  
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allocatedHours: number;
  teamMembers: TeamMember[];
  lists?: string[];  // Optional for when creating a new project, it's not needed 
  createdAt?: Date;
  updatedAt?: Date;
}