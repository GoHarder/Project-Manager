// MARK: Library
// -----------------------------------------------------------------------------
class SimpleStore<T> {
  data = $state<T>();
}

export const ProjectSt = new SimpleStore<App.ProjectDoc>();

export const ErrorSt = new SimpleStore<App.MainError['error']>();
