import { Login } from './views/auth.js';
import { BillsList, MyUnpaid, NewBill } from './views/bills.js';
import { Logout } from './views/logout.js';

const routes = {
  '/login': Login,
  '/': BillsList,
  '/new': NewBill,
  '/my-unpaid': MyUnpaid,
  '/logout': Logout,
  '/404': () => document.getElementById('app').innerHTML = '<div class="card">Not found</div>',
};

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