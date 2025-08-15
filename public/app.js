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
      <h1>Welcome to Chau Chau FC</h1>
      <p>Click on the menu to navigate to other pages.</p>
    `;
  } else if (page === 'page1') {
    content.innerHTML = `<h1>Page 1</h1><button onclick="callApi1()">Call API 1</button><div id="api1-response"></div>`;
  } else if (page === 'page2') {
    content.innerHTML = `<h1>Page 2</h1><button onclick="callApi2()">Call API 2</button><div id="api2-response"></div>`;
  } else if (page === 'menu') {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  content.innerHTML = `
    <section style="max-width: 800px; margin: 0 auto; padding: 16px;">
      <h1 style="margin: 0 0 4px;">Thực đơn hôm nay</h1>
      <p style="margin: 0 0 16px; opacity: 0.8;">${today}</p>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
        <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
          <h2 style="margin:0 0 8px; font-size:1.1rem;">Món chính</h2>
          <ul style="margin:0; padding-left:18px; line-height:1.6;">
            <li>Cơm gà xối mỡ</li>
            <li>Bún bò Huế</li>
            <li>Mì xào hải sản</li>
          </ul>
        </div>

        <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
          <h2 style="margin:0 0 8px; font-size:1.1rem;">Món kèm</h2>
          <ul style="margin:0; padding-left:18px; line-height:1.6;">
            <li>Gỏi cuốn</li>
            <li>Rau luộc chấm kho quẹt</li>
            <li>Canh chua cá</li>
          </ul>
        </div>

        <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
          <h2 style="margin:0 0 8px; font-size:1.1rem;">Đồ uống</h2>
          <ul style="margin:0; padding-left:18px; line-height:1.6;">
            <li>Trà đá</li>
            <li>Nước sấu</li>
            <li>Sinh tố xoài</li>
          </ul>
        </div>
      </div>
    </section>
  `;
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
