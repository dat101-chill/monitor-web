const API_URL = 'http://13.210.212.235:3000/websites';

document
  .getElementById('add-website-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const url = document.getElementById('url').value.trim();

    if (!name || !url) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
      });

      if (!res.ok) throw new Error('Không thêm được website');

      document.getElementById('name').value = '';
      document.getElementById('url').value = '';

      loadWebsites();
    } catch (err) {
      alert('Lỗi khi thêm website');
      console.error(err);
    }
  });
async function loadWebsites() {
  const tbody = document.getElementById('website-table');

  if (!tbody) {
    console.error(' Không tìm thấy tbody #website-table');
    return;
  }

  try {
    const response = await fetch('http://13.210.212.235:3000/websites');
    const data = await response.json();

    console.log('DATA FROM API:', data);

    tbody.innerHTML = '';

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Chưa có website nào</td></tr>';
      return;
    }

    data.forEach((site, index) => {
      const statusText = site.isOnline ? 'ONLINE' : 'OFFLINE';
      const statusClass = site.isOnline ? 'online' : 'offline';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td> <!-- STT -->
        <td>${site.name}</td>
        <td><a href="${site.url}" target="_blank">${site.url}</a></td>
        <td class="${statusClass}">${statusText}</td>
        <td>${site.responseTime ? site.responseTime + ' ms' : '-'}</td>
        <td>${site.responsible?.name || 'Chưa gán'}</td>
        <td>
          <button onclick="deleteWebsite(${site.id})"> Xóa</button>
        </td>
      `;

      tbody.appendChild(row);
    });

  } catch (err) {
    console.error(' Lỗi fetch:', err);
    tbody.innerHTML =
      '<tr><td colspan="5">Không kết nối được backend</td></tr>';
  }
}
async function deleteWebsite(id) {
  const confirmDelete = confirm('Bạn có chắc muốn xóa website này không?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://13.210.212.235:3000/websites/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('Xóa website thất bại');
      return;
    }

    loadWebsites();
  } catch (err) {
    console.error(err);
    alert('Lỗi khi xóa website');
  }
}


document.addEventListener('DOMContentLoaded', loadWebsites);

setInterval(loadWebsites, 10000);
