// Super-light SPA router using hash routes
export const routes = {};

export function route(path, handler) { routes[path] = handler; }

export function navigate(path) {
  if (location.hash !== `#${path}`) location.hash = `#${path}`;
  else render();
}

export function currentPath() {
  return location.hash.replace('#', '') || '/';
}

export function render() {
  const path = currentPath();
  const handler = routes[path] || routes['/404'];
  handler?.();
}

window.addEventListener('hashchange', render);