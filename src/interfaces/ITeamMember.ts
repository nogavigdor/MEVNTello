export interface TeamMember {
    userId: string;  // Use string for IDs in frontend
    role: 'leader' | 'member';
  }