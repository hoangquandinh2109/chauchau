let currentPage = 'home';

const navigateTo = (page) => {
  currentPage = page;
  renderPage(page);
};

const renderPage = (page) => {
  const content = document.getElementById('content');
  content.innerHTML = ''; // Clear existing content

  if (page === 'home') {
    content.innerHTML = `
      <h1>Welcome to Chau Chau Page</h1>
      <p>Click on the menu to navigate to other pages.</p>
    `;
  } else if (page === 'page1') {
    content.innerHTML = `<h1>Page 1</h1><button onclick="callApi1()">Call API 1</button><div id="api1-response"></div>`;
  } else if (page === 'page2') {
    content.innerHTML = `<h1>Page 2</h1><button onclick="callApi2()">Call API 2</button><div id="api2-response"></div>`;
  }
};

const callApi1 = async () => {
  const response = await fetch('/api/data1');
  const data = await response.json();
  document.getElementById('api1-response').innerText = data.message;
};

const callApi2 = async () => {
  const response = await fetch('/api/data2');
  const data = await response.json();
  document.getElementById('api2-response').innerText = data.message;
};

// Initial page load
renderPage(currentPage);
