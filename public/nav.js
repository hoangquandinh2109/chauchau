const nav = document.getElementById('nav');
const menuButton = document.getElementById('menu-btn');

export function setNav(user) {
  if (!user) {
    nav.innerHTML = '';
    menuButton.style.display = 'none';
    nav.classList.remove('show');
    return;
  }
  menuButton.style.display = '';
  
  nav.innerHTML = `
    <a href="#/" data-path="/" class="link">All Bills</a>
    <a href="#/new" data-path="/new" class="link">New Bill</a>
    <a href="#/my-unpaid" data-path="/my-unpaid" class="link">My Unpaid</a>
    <a href="#/logout" data-path="/logout" class="link">Logout</a>
  `;
  [...nav.querySelectorAll('a')].forEach((a) => {
    a.classList.toggle(
      'active',
      a.getAttribute('data-path') === (location.hash.replace('#', '') || '/'),
    );
  });

}

menuButton.addEventListener('click', () => {
  nav.classList.toggle('show');
});