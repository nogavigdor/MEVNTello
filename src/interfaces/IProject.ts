import { TeamMember } from './ITeamMember';

export interface Project {
  id: string;  
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allocatedHours: number;
  teamMembers: TeamMember[];
  lists?: string[];  
  createdAt?: Date;
  updatedAt?: Date;
}