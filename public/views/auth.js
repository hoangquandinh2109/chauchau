import { Auth } from '../api.js';
import { navigate } from '../router.js';

export function Login() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-container">
    <!-- Sign In -->
    <div class="card login-card">
      <h3>Sign In</h3>
      <form id="signin-form" class="form-grid">
        <input name="username" class="input" placeholder="Username" required />
        <input name="password" class="input" placeholder="Password" type="password" required />
        <button type="submit" class="btn primary">Login</button>
      </form>
    </div>

    <!-- Sign Up -->
    <div class="card login-card">
      <h3>Sign Up</h3>
      <form id="signup-form" class="form-grid">
        <input name="username" class="input" placeholder="Username" required />
        <input name="password" class="input" placeholder="Password" type="password" required />
        <input name="name" class="input" placeholder="Your full name" required />
        <button type="submit" class="btn secondary">Signup</button>
      </form>
    </div>
  </div>
  `;

  const signinForm = document.getElementById('signin-form');
  signinForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(signinForm);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();
    try {
      await Auth.login(username, password);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };

  const signupForm = document.getElementById('signup-form');
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();
    const name = formData.get('name').trim();
    try {
      await Auth.signup(username, password, name);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };
}
