export interface User {
    user: {
        id: string;
        name: string;
        email: string;
        role: [string];
    };
    token: string;
  }