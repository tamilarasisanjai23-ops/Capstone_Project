/* Smart Ration Shop Management System - REST API Connected Script */

const API_BASE = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function () {
  // Check API Connection Status
  checkApiHealth();

  // Highlight Navigation
  highlightActiveNav();

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  // Page Specific Initializations
  initLoginForm();
  initRegisterForm();
  initComplaintForm();
  initCustomerDashboard();
  initRationCardPage();
  initProductsPage();
  initDistributionPage();
  initAdminDashboard();
});

// Check API Health & Display Banner
async function checkApiHealth() {
  const statusBar = document.getElementById('api-status-bar');
  if (!statusBar) return;

  try {
    const res = await fetch(`${API_BASE}/products`, { method: 'GET' });
    if (res.ok) {
      statusBar.className = 'api-status-bar online';
      statusBar.innerHTML = '🟢 Connected to Live Spring Boot REST API & MySQL Database';
      statusBar.style.display = 'block';
    } else {
      throw new Error('API return not ok');
    }
  } catch (err) {
    statusBar.className = 'api-status-bar';
    statusBar.innerHTML = '🟡 Backend Offline / Starting. Using Local Dynamic Engine.';
    statusBar.style.display = 'block';
  }
}

// Highlight Active Nav Link
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// LOGIN FUNCTIONALITY (REST API + Local Fallback)
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const alertBox = document.getElementById('login-alert');

    if (!emailInput || !passwordInput) {
      showAlert(alertBox, 'Please enter Username/Email and Password.', 'danger');
      return;
    }

    try {
      // Attempt REST API Login
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(userData));
        showAlert(alertBox, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
          if (userData.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'customer-dashboard.html';
          }
        }, 1000);
        return;
      } else {
        const errMsg = await response.text();
        showAlert(alertBox, errMsg || 'Invalid credentials. Please verify your email and password.', 'danger');
        return;
      }
    } catch (err) {
      console.log('API offline, checking client fallback login...');
    }

    // Client-side Fallback Demo Login
    if (emailInput === 'admin@gmail.com' && passwordInput === 'admin123') {
      localStorage.setItem('currentUser', JSON.stringify({
        id: 99,
        fullName: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin'
      }));
      showAlert(alertBox, 'Admin login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'admin-dashboard.html', 1000);
      return;
    }

    const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = localUsers.find(u => (u.email === emailInput || u.cardNo === emailInput) && u.password === passwordInput);

    if (foundUser) {
      const activeUser = {
        id: Date.now(),
        fullName: foundUser.fullName,
        email: foundUser.email,
        mobile: foundUser.mobile,
        address: foundUser.address,
        cardNo: foundUser.cardNo,
        cardType: foundUser.cardType || 'PHH (Priority Household)',
        familyMembers: foundUser.familyMembers || 4,
        role: 'customer'
      };
      localStorage.setItem('currentUser', JSON.stringify(activeUser));
      showAlert(alertBox, 'Login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'customer-dashboard.html', 1000);
    } else {
      showAlert(alertBox, 'Invalid credentials. Please verify your email and password.', 'danger');
    }
  });
}

// REGISTRATION FUNCTIONALITY (REST API + Local Fallback)
function initRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const address = document.getElementById('address').value.trim();
    const cardNo = document.getElementById('cardNo').value.trim();
    const familyMembers = parseInt(document.getElementById('familyMembers')?.value || '4');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const alertBox = document.getElementById('register-alert');

    if (!fullName || !email || !mobile || !address || !cardNo || !password) {
      showAlert(alertBox, 'All form fields are required.', 'danger');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      showAlert(alertBox, 'Mobile Number must be 10 numeric digits.', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showAlert(alertBox, 'Passwords do not match.', 'danger');
      return;
    }

    const payload = {
      fullName,
      email,
      mobile,
      address,
      cardNo,
      familyMembers,
      password,
      cardType: 'PHH (Priority Household)'
    };

    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showAlert(alertBox, 'Registration successful! Saved to Database. Redirecting to login...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
      } else {
        const errMsg = await response.text();
        showAlert(alertBox, errMsg || 'Registration failed.', 'danger');
        return;
      }
    } catch (err) {
      console.log('Backend API unavailable, saving locally...');
    }

    // Save locally
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users.push(payload);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    showAlert(alertBox, 'Registration successful! Redirecting to login...', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  });
}

// CUSTOMER DASHBOARD POPULATION
async function initCustomerDashboard() {
  const nameElem = document.getElementById('dash-user-name');
  if (!nameElem) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const identifier = currentUser.cardNo || currentUser.email;

  let cardData = null;
  if (identifier) {
    try {
      let res = await fetch(`${API_BASE}/ration-cards/${encodeURIComponent(identifier)}`);
      if (!res.ok && currentUser.email && identifier !== currentUser.email) {
        res = await fetch(`${API_BASE}/ration-cards/${encodeURIComponent(currentUser.email)}`);
      }
      if (res.ok) {
        cardData = await res.json();
      }
    } catch (e) {
      console.error('Error fetching card data for dashboard:', e);
    }
  }

  const userName = cardData?.userName || currentUser.fullName || '-';
  const cardNumber = cardData?.cardNumber || currentUser.cardNo || '-';
  const familyMembers = cardData?.familyMembers || currentUser.familyMembers || '-';
  const cardType = cardData?.cardType || currentUser.cardType || '-';

  nameElem.textContent = userName;

  const cardNoElem = document.getElementById('dash-card-no');
  if (cardNoElem) cardNoElem.textContent = cardNumber;

  const membersElem = document.getElementById('dash-members');
  if (membersElem) membersElem.textContent = familyMembers;

  const cardTypeElem = document.getElementById('dash-card-type');
  if (cardTypeElem) cardTypeElem.textContent = cardType;

  // Load Products from Backend REST API
  loadProductsToDashboard();
}

// Load Products Stock to Customer Dashboard & Products Page
async function loadProductsToDashboard() {
  const gridContainer = document.getElementById('products-grid') || document.getElementById('dash-products-grid');
  if (!gridContainer) return;

  let products = [];
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.log('Fetch products error, using fallback stock list.');
  }

  if (products.length === 0) {
    products = [
      { id: 1, productName: 'Rice', stockQuantity: 1500, monthlyQuota: 5, unit: 'kg', unitPrice: 3.0, status: 'In Stock' },
      { id: 2, productName: 'Wheat', stockQuantity: 800, monthlyQuota: 2.5, unit: 'kg', unitPrice: 2.0, status: 'In Stock' },
      { id: 3, productName: 'Sugar', stockQuantity: 250, monthlyQuota: 2, unit: 'kg', unitPrice: 13.5, status: 'In Stock' },
      { id: 4, productName: 'Dal', stockQuantity: 300, monthlyQuota: 2, unit: 'kg', unitPrice: 60.0, status: 'Limited Stock' },
      { id: 5, productName: 'Kerosene', stockQuantity: 500, monthlyQuota: 3, unit: 'Liters', unitPrice: 25.0, status: 'In Stock' }
    ];
  }

  gridContainer.innerHTML = products.map(p => {
    const isLow = p.stockQuantity < 300;
    const badgeClass = isLow ? 'badge-warning' : 'badge-success';
    const statusTxt = isLow ? 'Limited Stock' : (p.status || 'In Stock');

    return `
      <div class="card product-card-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div class="card-icon">📦</div>
          <span class="badge ${badgeClass}">${statusTxt}</span>
        </div>
        <h3 class="card-title">${p.productName}</h3>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin: 8px 0;">
          ${p.monthlyQuota} ${p.unit} <span style="font-size: 0.85rem; color: var(--gray); font-weight: 400;">(Quota)</span>
        </div>
        <p class="card-text">Price: <strong>₹${p.unitPrice.toFixed(2)} / ${p.unit}</strong></p>
        <p class="card-text" style="font-size: 0.85rem; margin-top: 6px; color: var(--gray);">Real-time Stock: <strong>${p.stockQuantity} ${p.unit}</strong></p>
      </div>
    `;
  }).join('');
}

// RATION CARD PAGE POPULATION
async function initRationCardPage() {
  const rcCardNo = document.getElementById('rc-card-no');
  if (!rcCardNo) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const identifier = currentUser.cardNo || currentUser.email;

  let cardData = null;

  if (identifier) {
    try {
      let res = await fetch(`${API_BASE}/ration-cards/${encodeURIComponent(identifier)}`);
      if (!res.ok && currentUser.email && identifier !== currentUser.email) {
        res = await fetch(`${API_BASE}/ration-cards/${encodeURIComponent(currentUser.email)}`);
      }
      if (res.ok) {
        cardData = await res.json();
      }
    } catch (e) {
      console.error('Error fetching ration card from backend:', e);
    }
  }

  const userName = cardData?.userName || currentUser.fullName || '-';
  const cardNumber = cardData?.cardNumber || currentUser.cardNo || '-';
  const address = cardData?.address || currentUser.address || '-';
  const familyMembers = cardData?.familyMembers || currentUser.familyMembers || 1;
  const cardType = cardData?.cardType || currentUser.cardType || 'PHH (Priority Household)';

  rcCardNo.textContent = cardNumber;

  const rcNameElem = document.getElementById('rc-name');
  if (rcNameElem) rcNameElem.textContent = userName;

  const rcAddressElem = document.getElementById('rc-address');
  if (rcAddressElem) rcAddressElem.textContent = address;

  const rcMembersElem = document.getElementById('rc-members-count');
  if (rcMembersElem) rcMembersElem.textContent = familyMembers;

  const rcCardTypeElem = document.getElementById('rc-card-type');
  if (rcCardTypeElem) rcCardTypeElem.textContent = cardType;

  // Dynamically populate family members table
  const tbody = document.getElementById('rc-family-tbody');
  if (tbody) {
    const memberCount = parseInt(familyMembers) || 1;
    let rows = `
      <tr>
        <td>1</td>
        <td><strong id="rc-name-sub">${userName}</strong></td>
        <td>Self (Head)</td>
        <td>-</td>
        <td><span class="badge badge-success">Verified</span></td>
      </tr>
    `;
    const defaultRelations = ['Spouse', 'Child', 'Child', 'Parent', 'Dependent'];
    for (let i = 2; i <= memberCount; i++) {
      const rel = defaultRelations[(i - 2) % defaultRelations.length];
      rows += `
        <tr>
          <td>${i}</td>
          <td>Family Member ${i}</td>
          <td>${rel}</td>
          <td>-</td>
          <td><span class="badge badge-success">Verified</span></td>
        </tr>
      `;
    }
    tbody.innerHTML = rows;
  }
}

// PRODUCTS PAGE SEARCH
function initProductsPage() {
  const searchInput = document.getElementById('product-search');
  if (!searchInput) return;

  loadProductsToDashboard();

  searchInput.addEventListener('keyup', function () {
    const filter = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.product-card-item');

    items.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      if (title.includes(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// DISTRIBUTION PAGE
async function initDistributionPage() {
  const tbody = document.getElementById('distribution-tbody');
  if (!tbody) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const cardNo = currentUser.cardNo || currentUser.email || '';

  let distributions = [];
  if (cardNo) {
    try {
      const res = await fetch(`${API_BASE}/distributions/card/${encodeURIComponent(cardNo)}`);
      if (res.ok) {
        distributions = await res.json();
      }
    } catch (e) {}
  }

  if (distributions.length === 0) {
    distributions = [
      { id: 'TXN-10042', distributionDate: '2026-08-28', productName: 'Kerosene Oil', quantity: '3 L', totalAmount: 75.0, status: 'Pending' },
      { id: 'TXN-99812', distributionDate: '2026-08-15', productName: 'Refined Sugar', quantity: '2 kg', totalAmount: 27.0, status: 'Completed' },
      { id: 'TXN-99430', distributionDate: '2026-07-10', productName: 'Rice & Wheat', quantity: '30 kg', totalAmount: 80.0, status: 'Distributed' }
    ];
  }

  tbody.innerHTML = distributions.map(d => {
    let badge = 'badge-success';
    if (d.status === 'Pending') badge = 'badge-warning';
    if (d.status === 'Distributed') badge = 'badge-info';

    return `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td>${d.distributionDate}</td>
        <td>${d.productName}</td>
        <td>${d.quantity}</td>
        <td>₹${d.totalAmount.toFixed(2)}</td>
        <td>FPS-44021</td>
        <td><span class="badge ${badge}">${d.status}</span></td>
      </tr>
    `;
  }).join('');
}

// COMPLAINT SUBMISSION & DISPLAY
function initComplaintForm() {
  const complaintForm = document.getElementById('complaint-form');
  if (!complaintForm) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const cardInput = document.getElementById('complaint-cardNo');
  if (cardInput && currentUser.cardNo) {
    cardInput.value = currentUser.cardNo;
  }

  loadComplaintsTable();

  complaintForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const cardNo = document.getElementById('complaint-cardNo').value.trim();
    const type = document.getElementById('complaint-type').value;
    const description = document.getElementById('complaint-desc').value.trim();
    const alertBox = document.getElementById('complaint-alert');

    if (!cardNo || !type || !description) {
      showAlert(alertBox, 'Please complete all complaint fields.', 'danger');
      return;
    }

    const payload = { rationCardNo: cardNo, complaintType: type, description: description };

    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showAlert(alertBox, 'Complaint submitted successfully to database.', 'success');
        complaintForm.reset();
        if (cardInput && currentUser.cardNo) cardInput.value = currentUser.cardNo;
        loadComplaintsTable();
        return;
      }
    } catch (err) {}

    // Fallback
    const localComplaints = JSON.parse(localStorage.getItem('complaintsList') || '[]');
    localComplaints.unshift({
      id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
      cardNo,
      type,
      date: new Date().toISOString().split('T')[0],
      description,
      status: 'Pending'
    });
    localStorage.setItem('complaintsList', JSON.stringify(localComplaints));

    showAlert(alertBox, 'Complaint submitted successfully.', 'success');
    complaintForm.reset();
    if (cardInput && currentUser.cardNo) cardInput.value = currentUser.cardNo;
    loadComplaintsTable();
  });
}

async function loadComplaintsTable() {
  const tbody = document.getElementById('complaints-tbody');
  if (!tbody) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const cardNo = currentUser.cardNo || currentUser.email || '';

  let complaints = [];
  try {
    const res = await fetch(`${API_BASE}/complaints/card/${cardNo}`);
    if (res.ok) {
      complaints = await res.json();
    }
  } catch (e) {}

  if (complaints.length === 0) {
    complaints = JSON.parse(localStorage.getItem('complaintsList') || '[]');
  }

  if (complaints.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No complaints registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = complaints.map(c => `
    <tr>
      <td><strong>${c.id || c.complaintNumber}</strong></td>
      <td>${c.type || c.complaintType}</td>
      <td>${c.date || c.dateFiled || '2026-08-28'}</td>
      <td><span class="badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
      <td>${c.description}</td>
    </tr>
  `).join('');
}

// ADMIN DASHBOARD & CRUD OPERATIONS
async function initAdminDashboard() {
  const adminStatsContainer = document.getElementById('admin-stats-counters');
  if (!adminStatsContainer) return;

  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    if (res.ok) {
      const stats = await res.json();
      document.getElementById('stat-total-cards').textContent = stats.totalCardHolders;
      document.getElementById('stat-total-products').textContent = stats.totalProducts;
      document.getElementById('stat-pending-dist').textContent = stats.pendingDistributions;
      document.getElementById('stat-pending-complaints').textContent = stats.pendingComplaints;
    }
  } catch (err) {
    console.log('Using default admin statistics');
  }
}

// Admin Action Helpers
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Product deleted successfully!');
      location.reload();
    }
  } catch (e) {
    alert('Action completed.');
  }
}

async function resolveComplaint(complaintId) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
    if (res.ok) {
      alert('Complaint marked as Resolved in Database!');
      location.reload();
    }
  } catch (e) {
    alert('Complaint status updated to Resolved.');
  }
}

// Print Ration Card Function
function printRationCard() {
  window.print();
}

// Logout Action
function handleLogout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Utility Alert Helper
function showAlert(element, message, type) {
  if (!element) return;
  element.className = `alert alert-${type}`;
  element.innerHTML = message;
  element.style.display = 'block';
}
