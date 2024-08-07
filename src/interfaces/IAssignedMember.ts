import { TeamMember } from './ITeamMember';

export interface AssignedMember extends TeamMember {
    allocatedHours: number;
    usedHours: number;
}
