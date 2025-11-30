export interface StaticModule {
  getInstance: () => ModuleFactory;
}

export interface ModuleFactory {
  attachController(app: any): void;
  attachEventHandlers?(io: any): void;
}
