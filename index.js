import { lazy } from "react";

export const loadScope = (url, scope) => {
  const element = document.createElement("script");
  const promise = new Promise((resolve, reject) => {
    element.src = url;
    element.type = "text/javascript";
    element.async = true;
    element.onload = () => resolve(window[scope]);
    element.onerror = reject;
  });

  document.head.appendChild(element);
  return promise;
};

export const loadRemoteModule = async ({ url, scope, module }) => {
  try {
    const container = await loadScope(url, scope);

    await __webpack_init_sharing__("default");
    await container.init(__webpack_share_scopes__.default);

    const factory = await container.get(module);
    return factory();
  } catch (error) {
    throw error;
  }
};

export const loadLazyRemoteModule = ({ url, scope, module }) =>
  lazy(() => loadRemoteModule({ url, scope, module }));

export const loadLazyRemoteComponent = ({
  url,
  scope,
  module,
  componentName,
}) =>
  lazy(() =>
    loadRemoteModule({ url, scope, module }).then(
      (module) => module[componentName]
    )
  );
