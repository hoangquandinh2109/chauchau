import { Auth } from '../api.js';
import { navigate } from '../router.js';
import { setNav } from '../nav.js';

export async function requireAuth() {
  try {
    const { user } = await Auth.me();
    setNav(user);
    return user;
  } catch {
    navigate('/login');
    return null;
  }
}
