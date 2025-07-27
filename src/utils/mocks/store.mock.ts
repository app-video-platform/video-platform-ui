import { UserRole } from '../../api/models/user/user';

export const mockInitialState = {
  auth: {
    user: {
      firstName: 'Mock',
      lastName: 'Test',
      email: 'mock@test.test',
      role: [UserRole.USER],
    }, // provide a dummy user
    // any additional state your selectors require
  },
  // ... include other slices if needed
};
