import { ElectronAPI } from '@electron-toolkit/preload';
import { OneOf } from '@moss/types';

type NewProjectDoc = Pick<
  App.ProjectDoc,
  'customerName' | 'contractNo' | 'poNo' | 'price' | 'currency'
>;

type SearchResult = Oneof<
  [{ success: true; data: Partial<App.ProjectDoc> }, App.MainError]
>;

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      email: {
        get: (project: App.ProjectDoc, options: App.EmailOptions) => void;
      };
      fs: {
        openFolder: (path: string) => void;
        openProjectFolder: (contractNo: string) => void;
        searchFolder: (contractNo: string) => SearchResult;
      };
      listen: {
        error: (cb: (update: App.MainError) => void) => void;
        projects: (cb: (update: App.ProjectDoc[]) => void) => void;
      };
      projects: {
        post: (project: NewProjectDoc) => void;
        postCopy: (contractNo: string, project: NewProjectDoc) => void;
        get: () => void;
        getReport: () => Promise<
          Oneof<[{ success: true; data: App.ProjectReport }, App.MainError]>
        >;
        put: (project: App.ProjectDoc) => void;
        delete: (contractNo: string) => void;
      };
      settings: {
        get: () => Promise<
          Oneof<[{ success: true; data: App.Settings }, App.MainError]>
        >;
        put: (update: App.Settings) => void;
      };
    };
  }
}
