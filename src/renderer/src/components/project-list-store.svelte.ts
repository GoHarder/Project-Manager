// MARK: Globals
// -----------------------------------------------------------------------------
class ProjectStore {
  data: App.ProjectDoc[] = $state([]);

  constructor() {
    window.api.listen.projects((update) => {
      this.data = update;
    });
  }
}

// MARK: Library
// -----------------------------------------------------------------------------
export default new ProjectStore();
