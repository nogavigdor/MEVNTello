import { User } from '../interfaces/IUser';

import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
export const getMemberName = (memberId?: string ) => {
    const member = userStore.users.find((user: User) => user._id === memberId);
    return member ? member.username : 'Unknown';
  };