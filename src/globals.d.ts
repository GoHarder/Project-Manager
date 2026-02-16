import { type OneOf } from '@moss/types';

interface SystemError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  path?: string;
  address?: string;
  port?: number;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_SERVER: string;
      USER_EMAIL: string;
      USER_NAME: string;
    }
  }

  namespace App {
    type EmailOptions = {
      customerDrawings: boolean;
      orderChange: boolean;
      hasSheave: boolean;
      changes: string;
    };

    type MainError = {
      success: false;
      error: OneOf<[Error, SystemError]>;
    };

    type ProjectDoc = {
      _id: string;
      bookmarked: boolean;
      completed: string | null;
      contractNo: string;
      created: string;
      customerName: string;
      poNo: string;
      price: number;
      currency: string;
      released: string | null;
      user: string;
    };

    type ProjectReport = {
      thisWeek: {
        monday: string;
        projects: ProjectDoc[];
        total: {
          USD?: number;
          CAD?: number;
        };
      };
      lastWeek: {
        monday: string;
        projects: ProjectDoc[];
        total: {
          USD?: number;
          CAD?: number;
        };
      };
    };

    type Settings = {
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      server: string;
    };
  }
}

export {};
