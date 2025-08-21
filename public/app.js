import { navigate, render } from './router.js';

(async function boot() {
  try {
    const { user } = await import('./api.js').then(m => m.Auth.me());
    import('./nav.js').then(m => m.setNav(user));
    render();
  } catch {
    navigate('/login');
  }
})();
