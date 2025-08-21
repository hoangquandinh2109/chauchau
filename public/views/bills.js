import { Auth, Bills, Participants } from '../api.js';
import { BillCard } from '../components/BillCard.js';
import { requireAuth } from './requireAuth.js';

const app = document.getElementById('app');

export async function BillsList() {
  const user = await requireAuth();
  if (!user) return;

  const bills = await Bills.list();

  app.innerHTML = bills.length === 0
    ? `<div class="card center"><h3>📭 No bills yet. Create one!</h3></div>`
    : bills.map(b => BillCard(b, user)).join('');
  attachBillHandlers();
}

export async function MyUnpaid() {
  const user = await requireAuth();
  if (!user) return;
  const bills = await Bills.myUnpaid();
  app.innerHTML = bills.length === 0
    ? `<div class="card center"><h3>🎉 All paid. Nice!</h3></div>`
    : bills.map(b => BillCard(b, user)).join('');
  attachBillHandlers();
}

export async function NewBill() {
  await requireAuth();
  const participants = await Participants.list();

  app.innerHTML = `
    <div class="card">
      <h3>Create Bill</h3>
      <div class="form-grid">
        <label>Title*</label>
        <input id="title" class="input" placeholder="e.g., Sushi night" />
        <label>Amount*</label>
        <input id="amount" class="input" type="number" min="0" step="0.01" placeholder="e.g., 120" />
        <label>Description</label>
        <input id="desc" class="input" placeholder="Optional description" />
        <label>Transfer Info</label>
        <input id="transferInfo" class="input" placeholder="e.g., e-transfer email" />

        <label>Participants*</label>
        <div id="participants" class="participants-list">
          ${participants.map(u => `
            <label>
              <input type="checkbox" value="${u._id}" />
              ${u.name} (@${u.username})
            </label>
          `).join('')}
        </div>

        <button id="create" class="btn primary">Create</button>
      </div>
    </div>
  `;

  document.getElementById('create').onclick = async () => {
    const title = document.getElementById('title').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('desc').value.trim();
    const transferInfo = document.getElementById('transferInfo').value.trim();
    const participants = [...document.querySelectorAll('#participants input:checked')].map(x => x.value);

    if (!title || participants.length === 0 || isNaN(amount)) {
      return alert('Title, amount, and at least one participant required');
    }

    try {
      await Bills.create({ title, amount, description, transferInfo, participants });
      location.hash = '/';
    } catch (e) {
      alert(e.message);
    }
  };
}

function attachBillHandlers() {
  document.querySelectorAll('.card .toggle').forEach(btn => {
    btn.onclick = async (e) => {
      const card = e.target.closest('.card');
      const id = card.getAttribute('data-id');
      try {
        const updated = await Bills.togglePaid(id);
        const { user } = await Auth.me();
        card.outerHTML = BillCard(updated, user);
        attachBillHandlers();
      } catch (err) {
        alert(err.message);
      }
    };
  });
}
