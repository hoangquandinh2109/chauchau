import { Auth } from '../api.js';
import { setNav } from '../nav.js';
import { navigate } from '../router.js';

export async function Logout() {
  try { await Auth.logout(); } catch {}
  setNav(null);
  navigate('/login');
}
