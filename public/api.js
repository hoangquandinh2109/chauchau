export async function api(path, opts = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
}

export const Auth = {
  me: () => api('/me'),
  login: (username, password) => api('/login', { method: 'POST', body: { username, password } }),
  logout: () => api('/logout', { method: 'POST' }),
};

export const Bills = {
  list: () => api('/bills'),
  create: (payload) => api('/bills', { method: 'POST', body: payload }),
  togglePaid: (billId) => api(`/bills/${billId}/togglePaid`, { method: 'PUT' }),
  myUnpaid: () => api('/bills/unpaid/me'),
};