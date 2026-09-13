/* Smart Ration Shop Management System - JavaScript Logic */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Default LocalStorage Data
  initStorage();

  // Highlight Active Navigation Link
  highlightActiveNav();

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  // Page Specific Actions
  initLoginForm();
  initRegisterForm();
  initComplaintForm();
  initDashboardUserData();
  initProductsFilter();
});

// Default Storage Setup
function initStorage() {
  // Setup Demo Customer User
  if (!localStorage.getItem('registeredUsers')) {
    const demoUsers = [
      {
        fullName: 'Ramesh Kumar',
        email: 'user@gmail.com',
        mobile: '9876543210',
        address: '124, Gandhi Street, Sector 4, City',
        cardNo: 'RC-9876543210',
        password: '12345',
        cardType: 'PHH (Priority Household)',
        familyMembers: 4
      }
    ];
    localStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
  }

  // Setup Sample Complaints
  if (!localStorage.getItem('complaintsList')) {
    const initialComplaints = [
      {
        id: 'CMP-801',
        cardNo: 'RC-9876543210',
        type: 'Quantity Shortage',
        date: '2026-08-10',
        description: 'Received 18 kg rice instead of 20 kg monthly quota.',
        status: 'Resolved'
      },
      {
        id: 'CMP-802',
        cardNo: 'RC-9876543210',
        type: 'Shop Closed',
        date: '2026-08-20',
        description: 'Fair Price Shop was closed during official operational hours.',
        status: 'Pending'
      }
    ];
    localStorage.setItem('complaintsList', JSON.stringify(initialComplaints));
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

// Login Form Handling
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const API_BASE = 'http://localhost:8080/api';

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const alertBox = document.getElementById('login-alert');

    if (!emailInput || !passwordInput) {
      showAlert(alertBox, 'Please enter both Email/Username and Password.', 'danger');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(userData));
        showAlert(alertBox, 'Login successful! Redirecting...', 'success');
        setTimeout(function () {
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

    // Demo Admin Check
    if (emailInput === 'admin@gmail.com' && passwordInput === 'admin123') {
      localStorage.setItem('currentUser', JSON.stringify({
        fullName: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin'
      }));
      showAlert(alertBox, 'Admin login successful! Redirecting to Admin Dashboard...', 'success');
      setTimeout(function () {
        window.location.href = 'admin-dashboard.html';
      }, 1000);
      return;
    }

    // Check Registered Users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const matchedUser = users.find(u => (u.email === emailInput || u.cardNo === emailInput) && u.password === passwordInput);

    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify({
        ...matchedUser,
        role: 'customer'
      }));
      showAlert(alertBox, 'Login successful! Redirecting to Customer Dashboard...', 'success');
      setTimeout(function () {
        window.location.href = 'customer-dashboard.html';
      }, 1000);
    } else {
      showAlert(alertBox, 'Invalid Username/Email or Password. Please try again.', 'danger');
    }
  });
}

// Registration Form Handling
function initRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const address = document.getElementById('address').value.trim();
    const cardNo = document.getElementById('cardNo').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const alertBox = document.getElementById('register-alert');

    // Validation
    if (!fullName || !email || !mobile || !address || !cardNo || !password || !confirmPassword) {
      showAlert(alertBox, 'All fields are required.', 'danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(alertBox, 'Please enter a valid email address.', 'danger');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      showAlert(alertBox, 'Mobile Number must be a valid 10-digit number.', 'danger');
      return;
    }

    if (password.length < 4) {
      showAlert(alertBox, 'Password must be at least 4 characters long.', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showAlert(alertBox, 'Passwords do not match. Please verify.', 'danger');
      return;
    }

    // Save User
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find(u => u.email === email || u.cardNo === cardNo);

    if (existingUser) {
      showAlert(alertBox, 'A user with this Email or Ration Card Number already exists.', 'danger');
      return;
    }

    const newUser = {
      fullName: fullName,
      email: email,
      mobile: mobile,
      address: address,
      cardNo: cardNo,
      password: password,
      cardType: 'PHH (Priority Household)',
      familyMembers: 4
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    showAlert(alertBox, 'Registration successful! Redirecting to login page...', 'success');
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1500);
  });
}

// Complaint Form Handling & Dynamic Rendering
function initComplaintForm() {
  const complaintForm = document.getElementById('complaint-form');
  const complaintsTableBody = document.getElementById('complaints-tbody');

  // Pre-fill card number if user logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const cardNoInput = document.getElementById('complaint-cardNo');
  if (cardNoInput && currentUser.cardNo) {
    cardNoInput.value = currentUser.cardNo;
  }

  // Render Complaints List
  renderComplaintsList();

  if (complaintForm) {
    complaintForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const cardNo = document.getElementById('complaint-cardNo').value.trim();
      const complaintType = document.getElementById('complaint-type').value;
      const description = document.getElementById('complaint-desc').value.trim();
      const alertBox = document.getElementById('complaint-alert');

      if (!cardNo || !complaintType || !description) {
        showAlert(alertBox, 'Please complete all complaint fields.', 'danger');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const newComplaint = {
        id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
        cardNo: cardNo,
        type: complaintType,
        date: today,
        description: description,
        status: 'Pending'
      };

      const complaints = JSON.parse(localStorage.getItem('complaintsList') || '[]');
      complaints.unshift(newComplaint);
      localStorage.setItem('complaintsList', JSON.stringify(complaints));

      showAlert(alertBox, 'Complaint submitted successfully.', 'success');
      complaintForm.reset();
      if (cardNoInput && currentUser.cardNo) {
        cardNoInput.value = currentUser.cardNo;
      }

      renderComplaintsList();
    });
  }
}

function renderComplaintsList() {
  const tbody = document.getElementById('complaints-tbody');
  if (!tbody) return;

  const complaints = JSON.parse(localStorage.getItem('complaintsList') || '[]');
  if (complaints.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No complaints registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = complaints.map(c => {
    const badgeClass = c.status === 'Resolved' ? 'badge-success' : 'badge-warning';
    return `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.type}</td>
        <td>${c.date}</td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
        <td>${c.description}</td>
      </tr>
    `;
  }).join('');
}

// Populate User Data in Customer Dashboard & Ration Card
async function initDashboardUserData() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const identifier = currentUser.cardNo || currentUser.email;

  const API_BASE = 'http://localhost:8080/api';

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
      console.error('Error fetching card data:', e);
    }
  }

  const userName = cardData?.userName || currentUser.fullName || '-';
  const cardNumber = cardData?.cardNumber || currentUser.cardNo || '-';
  const address = cardData?.address || currentUser.address || '-';
  const familyMembers = cardData?.familyMembers || currentUser.familyMembers || 1;
  const cardType = cardData?.cardType || currentUser.cardType || 'PHH (Priority Household)';

  // Dashboard User Name & Details
  const nameElem = document.getElementById('dash-user-name');
  const cardElem = document.getElementById('dash-card-no');
  const membersElem = document.getElementById('dash-members');
  const dashCardType = document.getElementById('dash-card-type');
  const addressElem = document.getElementById('dash-address');

  if (nameElem) nameElem.textContent = userName;
  if (cardElem) cardElem.textContent = cardNumber;
  if (membersElem) membersElem.textContent = familyMembers;
  if (dashCardType) dashCardType.textContent = cardType;
  if (addressElem) addressElem.textContent = address;

  // Ration Card Details Sync
  const rcName = document.getElementById('rc-name');
  const rcCardNo = document.getElementById('rc-card-no');
  const rcAddress = document.getElementById('rc-address');
  const rcMembers = document.getElementById('rc-members-count');
  const rcCardType = document.getElementById('rc-card-type');

  if (rcName) rcName.textContent = userName;
  if (rcCardNo) rcCardNo.textContent = cardNumber;
  if (rcAddress) rcAddress.textContent = address;
  if (rcMembers) rcMembers.textContent = familyMembers;
  if (rcCardType) rcCardType.textContent = cardType;

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

// Product Search / Filter Tool
function initProductsFilter() {
  const searchInput = document.getElementById('product-search');
  if (!searchInput) return;

  searchInput.addEventListener('keyup', function () {
    const filter = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card-item');

    productCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      if (title.includes(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
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

// Utility Function to Display Styled Alerts
function showAlert(element, message, type) {
  if (!element) return;
  element.className = `alert alert-${type}`;
  element.innerHTML = message;
  element.style.display = 'block';
}
