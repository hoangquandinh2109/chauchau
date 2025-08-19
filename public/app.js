import { route, render, navigate } from './router.js';
import { Auth, Bills } from './api.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function setNav(user) {
  if (!user) { nav.classList.add('hidden'); nav.innerHTML = ''; return; }
  nav.classList.remove('hidden');
  nav.innerHTML = `
    <a href="#/" data-path="/" class="link">All Bills</a>
    <a href="#/new" data-path="/new" class="link">New Bill</a>
    <a href="#/my-unpaid" data-path="/my-unpaid" class="link">My Unpaid</a>
    <a href="#/logout" data-path="/logout" class="link">Logout (${user.username})</a>
  `;
  // highlight active
  [...nav.querySelectorAll('a')].forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-path') === (location.hash.replace('#','') || '/'));
  });
}

async function requireAuth() {
  try {
    const { user } = await Auth.me();
    setNav(user);
    return user;
  } catch {
    navigate('/login');
    return null;
  }
}

// Views
function Login() {
  app.innerHTML = `
    <div class="card">
      <h3>Login</h3>
      <div class="form-grid">
        <input id="u" class="input" placeholder="Username" />
        <input id="p" class="input" placeholder="Password" type="password" />
        <button id="login" class="btn primary">Login</button>
      </div>
      <p class="small">Demo users: ethan / mark / zara (password 123)</p>
    </div>
  `;

  document.getElementById('login').onclick = async () => {
    const username = document.getElementById('u').value.trim();
    const password = document.getElementById('p').value.trim();
    try {
      await Auth.login(username, password);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };
}

async function BillsList() {
  const user = await requireAuth();
  if (!user) return;

  const bills = await Bills.list();
  app.innerHTML = `
    ${bills.map(b => BillCard(b, user)).join('')}
  `;
  attachBillHandlers();
}

function BillCard(bill, user) {
  const owner = bill.owner === user.username ? '<span class="pill">You are the owner</span>' : '';
  const transfer = bill.transferInfo || {};
  const me = bill.participants.find(p => p.username === user.username);
  const paidLabel = me?.paid ? 'Paid' : 'Mark as Paid';
  const paidBtnClass = me?.paid ? 'btn' : 'btn primary';

  return `
    <div class="card" data-id="${bill.id}">
      <div class="title">${bill.title} ${owner}</div>
      <div class="small">By ${bill.owner}</div>
      ${bill.description ? `<p>${bill.description}</p>` : ''}
      <div class="small">Transfer: ${transfer.bank || ''} ${transfer.account || ''} ${transfer.note ? '— ' + transfer.note : ''}</div>
      <hr />
      <div>
        ${bill.participants.map(p => `
          <div class="participant ${p.paid ? 'paid' : ''}">
            <span>@${p.username}</span>
            <span class="status">${p.paid ? 'has paid' : 'not yet'}</span>
            ${p.username === user.username ? `<button class="toggle ${paidBtnClass}">${paidLabel}</button>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function attachBillHandlers() {
  document.querySelectorAll('.card .toggle').forEach(btn => {
    btn.onclick = async (e) => {
      const card = e.target.closest('.card');
      const id = card.getAttribute('data-id');
      try {
        const updated = await Bills.togglePaid(id);
        // re-render just this card
        const { user } = await Auth.me();
        card.outerHTML = BillCard(updated, user);
        attachBillHandlers();
      } catch (err) {
        alert(err.message);
      }
    };
  });
}

function NewBill() {
  requireAuth();
  app.innerHTML = `
    <div class="card">
      <h3>Create Bill</h3>
      <div class="form-grid">
        <label>Title*</label>
        <input id="title" class="input" placeholder="e.g., Sushi night" />

        <label>Description</label>
        <input id="desc" class="input" placeholder="Optional description" />

        <div class="row">
          <div>
            <label>Bank</label>
            <input id="bank" class="input" placeholder="Bank name" />
          </div>
          <div>
            <label>Account</label>
            <input id="account" class="input" placeholder="Account / number" />
          </div>
        </div>

        <label>Note</label>
        <input id="note" class="input" placeholder="e.g., e-transfer email" />

        <label>Participants* (comma separated usernames)</label>
        <input id="parts" class="input" placeholder="ethan, mark, zara" />

        <button id="create" class="btn primary">Create</button>
      </div>
    </div>
  `;

  document.getElementById('create').onclick = async () => {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('desc').value.trim();
    const bank = document.getElementById('bank').value.trim();
    const account = document.getElementById('account').value.trim();
    const note = document.getElementById('note').value.trim();
    const participants = document.getElementById('parts').value.split(',').map(x => x.trim()).filter(Boolean);

    if (!title || participants.length === 0) return alert('Title and at least one participant required');

    try {
      await Bills.create({ title, description, transferInfo: { bank, account, note }, participants });
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };
}

async function MyUnpaid() {
  const user = await requireAuth();
  if (!user) return;
  const bills = await Bills.myUnpaid();
  app.innerHTML = bills.length === 0
    ? `<div class="card center"><h3>🎉 All paid. Nice!</h3></div>`
    : bills.map(b => BillCard(b, user)).join('');
  attachBillHandlers();
}

async function Logout() {
  try { await Auth.logout(); } catch {}
  setNav(null);
  navigate('/login');
}

// Routes
route('/login', Login);
route('/', BillsList);
route('/new', NewBill);
route('/my-unpaid', MyUnpaid);
route('/logout', Logout);
route('/404', () => app.innerHTML = '<div class="card">Not found</div>');

// Initial boot: check session & go default
(async function boot() {
  try {
    const { user } = await Auth.me();
    setNav(user);
    render();
  } catch {
    navigate('/login');
  }
})();