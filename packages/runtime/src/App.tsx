import React, { useRef } from 'react';
import { initStateAndMethod } from './utils/initStateAndMethod';
import { ImplWrapper } from './components/_internal/ImplWrapper';
import { AppProps, UIServices } from './types/RuntimeSchema';
import { DebugEvent, DebugStore } from './services/DebugComponents';
import { RuntimeAppSchemaManager } from './services/RuntimeAppSchemaManager';
import { resolveTreeMap } from './utils/resolveTreeMap';

// inject modules to App
export function genApp(services: UIServices) {
  return (props: Omit<AppProps, 'services'>) => {
    return <App {...props} services={services} />;
  };
}

export const App: React.FC<AppProps> = props => {
  const {
    options,
    services,
    componentWrapper,
    gridCallbacks,
    debugStore = true,
    debugEvent = true,
  } = props;
  const runtimeAppSchemaManager = useRef(new RuntimeAppSchemaManager());
  const app = runtimeAppSchemaManager.current.update(options);

  initStateAndMethod(services.registry, services.stateManager, app.spec.components);

  const { treeMap, topLevelComponents } = resolveTreeMap(app.spec.components);
  return (
    <div className="App" style={{ height: '100vh', overflow: 'auto' }}>
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            services={services}
            treeMap={treeMap}
            app={app}
            componentWrapper={componentWrapper}
            gridCallbacks={gridCallbacks}
          />
        );
      })}
      {debugStore && <DebugStore stateManager={services.stateManager} />}
      {debugEvent && <DebugEvent apiService={services.apiService} />}
    </div>
  );
};
