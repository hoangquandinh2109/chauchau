export function BillCard(bill, user) {
  const owner = bill.owner === user.username ? '<span class="pill">You are the owner</span>' : '';
  const transferInfo = bill.transferInfo || '';
  const me = bill.participants.find(p => p.user._id === user.id);
  const paidLabel = me?.paid ? 'Paid' : 'Mark as Paid';
  const paidBtnClass = me?.paid ? '' : 'primary';
  const amountPerPerson = (bill.amount / bill.participants.length).toFixed(2);

  return `
    <div class="card" data-id="${bill._id}">
      <div class="title">${bill.title} ${owner}</div>
      <div class="small">By ${bill.owner.name}</div>
      <div class="small">Amount: $${bill.amount.toFixed(2)}</div>
      <div class="small">Each owes: $${amountPerPerson}</div>
      ${bill.description ? `<p>${bill.description}</p>` : ''}
      <div class="small">Transfer: ${transferInfo}</div>
      <hr />
      <div>
        ${bill.participants.map(p => `
          <div class="participant ${p.paid ? 'paid' : ''}">
            <span>@${p.user.name}</span>
            <span class="status">${p.paid ? `has paid $${amountPerPerson}` : 'not yet'}</span>
            ${p.user._id === user.id ? `<button class="toggle btn btn-small ${paidBtnClass}">${paidLabel}</button>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}