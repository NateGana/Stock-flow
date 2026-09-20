/* ==========================================================================
   StockFlow — Application Logic
   All data is persisted to localStorage. No backend required.
   ========================================================================== */

const STORAGE_KEY = 'stockflow_data_v1';

/* ---------------------------------------------------------------------- *
 * Sample / demo data — used only the first time the app runs
 * ---------------------------------------------------------------------- */
function buildDemoData() {
  const suppliers = [
    { id: 'SUP-001', name: 'Pacific Trade Distributors', contact: 'Daniel Uy', phone: '0917 555 0142', email: 'orders@pacifictrade.com' },
    { id: 'SUP-002', name: 'Manila Office Supply Co.', contact: 'Grace Villanueva', phone: '0928 441 7720', email: 'sales@manilaoffice.ph' },
    { id: 'SUP-003', name: 'Northbridge Electronics', contact: 'Ramon Castillo', phone: '0939 210 5588', email: 'accounts@northbridge.io' },
    { id: 'SUP-004', name: 'GreenLeaf Packaging', contact: 'Ana Bautista', phone: '0906 774 3312', email: 'hello@greenleafpack.com' },
  ];

  const products = [
    { id: 'PRD-1001', name: 'Wireless Mouse M185', category: 'Electronics', supplierId: 'SUP-003', price: 495, stock: 84, reorder: 20 },
    { id: 'PRD-1002', name: 'Mechanical Keyboard K2', category: 'Electronics', supplierId: 'SUP-003', price: 1899, stock: 12, reorder: 15 },
    { id: 'PRD-1003', name: 'USB-C Hub 7-in-1', category: 'Electronics', supplierId: 'SUP-003', price: 899, stock: 0, reorder: 10 },
    { id: 'PRD-1004', name: 'A4 Bond Paper (Ream)', category: 'Office Supplies', supplierId: 'SUP-002', price: 210, stock: 260, reorder: 50 },
    { id: 'PRD-1005', name: 'Gel Pen Set (12pcs)', category: 'Office Supplies', supplierId: 'SUP-002', price: 145, stock: 38, reorder: 40 },
    { id: 'PRD-1006', name: 'Sticky Notes 3x3 (Pack)', category: 'Office Supplies', supplierId: 'SUP-002', price: 65, stock: 5, reorder: 25 },
    { id: 'PRD-1007', name: 'Corrugated Box (Medium)', category: 'Packaging', supplierId: 'SUP-004', price: 28, stock: 540, reorder: 100 },
    { id: 'PRD-1008', name: 'Bubble Wrap Roll 1m x 10m', category: 'Packaging', supplierId: 'SUP-004', price: 320, stock: 22, reorder: 15 },
    { id: 'PRD-1009', name: 'Packing Tape (Clear)', category: 'Packaging', supplierId: 'SUP-004', price: 55, stock: 0, reorder: 30 },
    { id: 'PRD-1010', name: 'Stainless Steel Water Bottle', category: 'Merchandise', supplierId: 'SUP-001', price: 350, stock: 65, reorder: 20 },
    { id: 'PRD-1011', name: 'Canvas Tote Bag', category: 'Merchandise', supplierId: 'SUP-001', price: 180, stock: 8, reorder: 20 },
    { id: 'PRD-1012', name: 'Ceramic Coffee Mug 350ml', category: 'Merchandise', supplierId: 'SUP-001', price: 145, stock: 120, reorder: 30 },
  ];

  const now = new Date();
  const daysAgo = (n) => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toISOString(); };

  const activity = [
    { id: 'ACT-1', productId: 'PRD-1002', type: 'Stock Out', qty: 8, reason: 'Bulk order — client delivery', date: daysAgo(0) },
    { id: 'ACT-2', productId: 'PRD-1001', type: 'Stock In', qty: 50, reason: 'New shipment received', date: daysAgo(1) },
    { id: 'ACT-3', productId: 'PRD-1006', type: 'Stock Out', qty: 15, reason: 'Internal office use', date: daysAgo(1) },
    { id: 'ACT-4', productId: 'PRD-1009', type: 'Stock Out', qty: 30, reason: 'Warehouse packing run', date: daysAgo(2) },
    { id: 'ACT-5', productId: 'PRD-1007', type: 'Stock In', qty: 200, reason: 'Restocked from supplier', date: daysAgo(3) },
    { id: 'ACT-6', productId: 'PRD-1011', type: 'Stock Out', qty: 12, reason: 'Event giveaways', date: daysAgo(4) },
    { id: 'ACT-7', productId: 'PRD-1003', type: 'Stock Out', qty: 18, reason: 'Sold out — online store', date: daysAgo(5) },
    { id: 'ACT-8', productId: 'PRD-1010', type: 'Stock In', qty: 40, reason: 'Quarterly merchandise order', date: daysAgo(6) },
  ];

  return { suppliers, products, activity };
}

let db = loadData();

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to demo data */ }
  }
  const demo = buildDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

/* ---------------------------------------------------------------------- *
 * Utilities
 * ---------------------------------------------------------------------- */
function formatCurrency(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function generateId(prefix, list) {
  let max = 1000;
  list.forEach(item => {
    const num = parseInt(item.id.split('-')[1], 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return `${prefix}-${max + 1}`;
}
function getStatus(product) {
  if (product.stock <= 0) return 'Out of Stock';
  if (product.stock <= product.reorder) return 'Low Stock';
  return 'In Stock';
}
function statusBadgeClass(status) {
  if (status === 'In Stock') return 'badge-green';
  if (status === 'Low Stock') return 'badge-amber';
  return 'badge-red';
}
function supplierById(id) { return db.suppliers.find(s => s.id === id); }
function productById(id) { return db.products.find(p => p.id === id); }

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5m0-3h.01"/></svg>'
  };
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
});

let confirmAction = null;
function askConfirm(title, text, actionLabel, onConfirm) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalText').textContent = text;
  const btn = document.getElementById('confirmModalActionBtn');
  btn.textContent = actionLabel;
  confirmAction = onConfirm;
  openModal('confirmModalOverlay');
}
document.getElementById('confirmModalActionBtn').addEventListener('click', () => {
  if (confirmAction) confirmAction();
  closeModal('confirmModalOverlay');
});

/* ---------------------------------------------------------------------- *
 * Navigation
 * ---------------------------------------------------------------------- */
const pageMeta = {
  dashboard: ['Dashboard', 'Overview of your inventory health'],
  products: ['Products', 'Manage your product catalog and stock levels'],
  activity: ['Inventory Activity', 'Track every stock movement in and out'],
  suppliers: ['Suppliers', 'Manage supplier information and contacts'],
  reports: ['Reports', 'Summaries and history for decision-making'],
};

function switchView(view) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  document.getElementById('pageTitle').textContent = pageMeta[view][0];
  document.getElementById('pageSubtitle').textContent = pageMeta[view][1];
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
  renderAll();
}
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});
document.getElementById('goLowStock').addEventListener('click', () => {
  switchView('reports');
  showReportTab('lowstock');
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('scrim').classList.add('open');
});
document.getElementById('scrim').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
});

/* ---------------------------------------------------------------------- *
 * Dashboard rendering
 * ---------------------------------------------------------------------- */
function renderDashboard() {
  const products = db.products;
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter(p => getStatus(p) === 'Low Stock').length;
  const outStock = products.filter(p => getStatus(p) === 'Out of Stock').length;
  const invValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  document.getElementById('statTotalProducts').textContent = totalProducts;
  document.getElementById('statTotalStock').textContent = totalStock.toLocaleString();
  document.getElementById('statLowStock').textContent = lowStock;
  document.getElementById('statOutStock').textContent = outStock;
  document.getElementById('statInvValue').textContent = formatCurrency(invValue);

  // recent activity (last 6)
  const recent = [...db.activity].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const body = document.getElementById('recentActivityBody');
  body.innerHTML = '';
  document.getElementById('recentActivityEmpty').hidden = recent.length > 0;
  recent.forEach(a => {
    const product = productById(a.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono">${formatDate(a.date)}</td>
      <td class="cell-strong">${product ? product.name : 'Unknown Product'}</td>
      <td><span class="badge ${a.type === 'Stock In' ? 'badge-green' : 'badge-amber'}"><span class="badge-dot"></span>${a.type}</span></td>
      <td>${a.qty}</td>
      <td>${a.reason}</td>`;
    body.appendChild(tr);
  });

  // status breakdown bars
  const inStock = totalProducts - lowStock - outStock;
  const statusData = [
    ['In Stock', inStock, 'var(--green)'],
    ['Low Stock', lowStock, 'var(--amber-dark)'],
    ['Out of Stock', outStock, 'var(--red)'],
  ];
  const statusBars = document.getElementById('statusBars');
  statusBars.innerHTML = statusData.map(([label, count, color]) => {
    const pct = totalProducts ? Math.round((count / totalProducts) * 100) : 0;
    return `<div class="status-bar-row">
      <div class="status-bar-label"><span>${label}</span><span>${count} (${pct}%)</span></div>
      <div class="status-bar-track"><div class="status-bar-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  }).join('');

  // category breakdown
  const catMap = {};
  products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + p.stock; });
  const totalCatStock = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
  const catColors = ['var(--teal)', 'var(--blue)', 'var(--amber-dark)', 'var(--green)', 'var(--red)'];
  const categoryBars = document.getElementById('categoryBars');
  categoryBars.innerHTML = Object.entries(catMap).map(([cat, stock], i) => {
    const pct = Math.round((stock / totalCatStock) * 100);
    return `<div class="status-bar-row">
      <div class="status-bar-label"><span>${cat}</span><span>${stock} units</span></div>
      <div class="status-bar-track"><div class="status-bar-fill" style="width:${pct}%;background:${catColors[i % catColors.length]}"></div></div>
    </div>`;
  }).join('') || '<p style="color:var(--slate-500);font-size:13px;">No category data yet.</p>';
}

/* ---------------------------------------------------------------------- *
 * Products rendering
 * ---------------------------------------------------------------------- */
function populateCategoryFilter() {
  const select = document.getElementById('categoryFilter');
  const current = select.value;
  const categories = [...new Set(db.products.map(p => p.category))].sort();
  select.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
  select.value = current;

  const datalist = document.getElementById('categoryList');
  datalist.innerHTML = categories.map(c => `<option value="${c}">`).join('');
}

function populateSupplierSelect() {
  const select = document.getElementById('productSupplier');
  select.innerHTML = db.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function getFilteredProducts() {
  const search = document.getElementById('productSearch').value.trim().toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;
  const sort = document.getElementById('sortProducts').value;

  let list = db.products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
    const matchesCategory = !category || p.category === category;
    const matchesStatus = !status || getStatus(p) === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const [field, dir] = sort.split('-');
  list.sort((a, b) => {
    let av, bv;
    if (field === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (field === 'stock') { av = a.stock; bv = b.stock; }
    else { av = a.price; bv = b.price; }
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
  return list;
}

function renderProducts() {
  populateCategoryFilter();
  const list = getFilteredProducts();
  const body = document.getElementById('productsBody');
  body.innerHTML = '';
  document.getElementById('productsEmpty').hidden = list.length > 0;

  list.forEach(p => {
    const status = getStatus(p);
    const supplier = supplierById(p.supplierId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono">${p.id}</td>
      <td class="cell-strong">${p.name}</td>
      <td>${p.category}</td>
      <td>${supplier ? supplier.name : '—'}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.stock}</td>
      <td>${p.reorder}</td>
      <td><span class="badge ${statusBadgeClass(status)}"><span class="badge-dot"></span>${status}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn add" title="Add Stock" data-action="add-stock" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
          <button class="icon-btn remove" title="Remove Stock" data-action="remove-stock" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
          <button class="icon-btn" title="Edit" data-action="edit-product" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          <button class="icon-btn danger" title="Delete" data-action="delete-product" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
        </div>
      </td>`;
    body.appendChild(tr);
  });
}

document.getElementById('productSearch').addEventListener('input', renderProducts);
document.getElementById('categoryFilter').addEventListener('change', renderProducts);
document.getElementById('statusFilter').addEventListener('change', renderProducts);
document.getElementById('sortProducts').addEventListener('change', renderProducts);
document.getElementById('globalSearch').addEventListener('input', (e) => {
  switchView('products');
  document.getElementById('productSearch').value = e.target.value;
  renderProducts();
});

document.getElementById('productsBody').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const product = productById(id);
  const action = btn.dataset.action;

  if (action === 'edit-product') openProductModal(product);
  if (action === 'delete-product') {
    askConfirm('Delete product?', `"${product.name}" will be permanently removed from your inventory.`, 'Delete', () => {
      db.products = db.products.filter(p => p.id !== id);
      saveData();
      renderAll();
      showToast('Product deleted', 'success');
    });
  }
  if (action === 'add-stock') openStockModal(product, 'in');
  if (action === 'remove-stock') openStockModal(product, 'out');
});

/* Product modal */
function openProductModal(product) {
  populateSupplierSelect();
  const title = document.getElementById('productModalTitle');
  const submitBtn = document.getElementById('productSubmitBtn');
  document.getElementById('productForm').reset();

  if (product) {
    title.textContent = 'Edit Product';
    submitBtn.textContent = 'Save Changes';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSupplier').value = product.supplierId;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productReorder').value = product.reorder;
  } else {
    title.textContent = 'Add Product';
    submitBtn.textContent = 'Add Product';
    document.getElementById('productId').value = '';
  }
  openModal('productModalOverlay');
}
document.getElementById('addProductBtn').addEventListener('click', () => openProductModal(null));

document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const data = {
    name: document.getElementById('productName').value.trim(),
    category: document.getElementById('productCategory').value.trim(),
    supplierId: document.getElementById('productSupplier').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value, 10),
    reorder: parseInt(document.getElementById('productReorder').value, 10),
  };

  if (id) {
    const product = productById(id);
    Object.assign(product, data);
    showToast('Product updated', 'success');
  } else {
    const newId = generateId('PRD', db.products);
    db.products.push({ id: newId, ...data });
    showToast('Product added', 'success');
  }
  saveData();
  closeModal('productModalOverlay');
  renderAll();
});

/* Stock in/out modal */
function openStockModal(product, mode) {
  document.getElementById('stockProductId').value = product.id;
  document.getElementById('stockMode').value = mode;
  document.getElementById('stockModalTitle').textContent = mode === 'in' ? 'Add Stock' : 'Remove Stock';
  document.getElementById('stockSubmitBtn').textContent = mode === 'in' ? 'Add Stock' : 'Remove Stock';
  document.getElementById('stockProductName').textContent = `${product.name} — currently ${product.stock} units in stock`;
  document.getElementById('stockQty').value = '';
  document.getElementById('stockQty').max = mode === 'out' ? product.stock : '';
  document.getElementById('stockReason').value = '';
  openModal('stockModalOverlay');
}

document.getElementById('stockForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('stockProductId').value;
  const mode = document.getElementById('stockMode').value;
  const qty = parseInt(document.getElementById('stockQty').value, 10);
  const reason = document.getElementById('stockReason').value.trim();
  const product = productById(id);

  if (mode === 'out' && qty > product.stock) {
    showToast(`Cannot remove more than the ${product.stock} units available`, 'error');
    return;
  }

  product.stock += mode === 'in' ? qty : -qty;
  db.activity.unshift({
    id: 'ACT-' + Date.now(),
    productId: id,
    type: mode === 'in' ? 'Stock In' : 'Stock Out',
    qty, reason,
    date: new Date().toISOString(),
  });
  saveData();
  closeModal('stockModalOverlay');
  renderAll();
  showToast(mode === 'in' ? 'Stock added' : 'Stock removed', 'success');
});

/* ---------------------------------------------------------------------- *
 * Activity view
 * ---------------------------------------------------------------------- */
function renderActivity() {
  const typeFilter = document.getElementById('activityTypeFilter').value;
  let list = [...db.activity].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (typeFilter) list = list.filter(a => a.type === typeFilter);

  const body = document.getElementById('activityBody');
  body.innerHTML = '';
  document.getElementById('activityEmpty').hidden = list.length > 0;
  list.forEach(a => {
    const product = productById(a.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono">${formatDate(a.date)}</td>
      <td class="cell-strong">${product ? product.name : 'Unknown Product'}</td>
      <td><span class="badge ${a.type === 'Stock In' ? 'badge-green' : 'badge-amber'}"><span class="badge-dot"></span>${a.type}</span></td>
      <td>${a.qty}</td>
      <td>${a.reason}</td>`;
    body.appendChild(tr);
  });
}
document.getElementById('activityTypeFilter').addEventListener('change', renderActivity);

/* ---------------------------------------------------------------------- *
 * Suppliers view
 * ---------------------------------------------------------------------- */
function renderSuppliers() {
  const search = document.getElementById('supplierSearch').value.trim().toLowerCase();
  const list = db.suppliers.filter(s => !search || s.name.toLowerCase().includes(search));
  const grid = document.getElementById('suppliersGrid');
  grid.innerHTML = '';
  document.getElementById('suppliersEmpty').hidden = list.length > 0;

  list.forEach(s => {
    const productsSupplied = db.products.filter(p => p.supplierId === s.id);
    const card = document.createElement('div');
    card.className = 'supplier-card';
    card.innerHTML = `
      <div class="supplier-card-head">
        <div>
          <h3>${s.name}</h3>
          <span class="mono" style="font-size:11.5px;">${s.id}</span>
        </div>
        <div class="supplier-actions">
          <button class="icon-btn" title="Edit" data-action="edit-supplier" data-id="${s.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          <button class="icon-btn danger" title="Delete" data-action="delete-supplier" data-id="${s.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
        </div>
      </div>
      <div class="supplier-meta">
        <span><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>${s.contact}</span>
        <span><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8 9.7a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z"/></svg>${s.phone}</span>
        <span><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4V4z"/><path d="M22 6l-10 7L2 6"/></svg>${s.email}</span>
      </div>
      <div class="supplier-products">${productsSupplied.length} product${productsSupplied.length !== 1 ? 's' : ''} supplied</div>`;
    grid.appendChild(card);
  });
}
document.getElementById('supplierSearch').addEventListener('input', renderSuppliers);

document.getElementById('suppliersGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const supplier = db.suppliers.find(s => s.id === id);
  if (btn.dataset.action === 'edit-supplier') openSupplierModal(supplier);
  if (btn.dataset.action === 'delete-supplier') {
    const linked = db.products.some(p => p.supplierId === id);
    if (linked) {
      showToast('Cannot delete — supplier is linked to existing products', 'error');
      return;
    }
    askConfirm('Delete supplier?', `"${supplier.name}" will be permanently removed.`, 'Delete', () => {
      db.suppliers = db.suppliers.filter(s => s.id !== id);
      saveData();
      renderAll();
      showToast('Supplier deleted', 'success');
    });
  }
});

function openSupplierModal(supplier) {
  document.getElementById('supplierForm').reset();
  const title = document.getElementById('supplierModalTitle');
  const submitBtn = document.getElementById('supplierSubmitBtn');
  if (supplier) {
    title.textContent = 'Edit Supplier';
    submitBtn.textContent = 'Save Changes';
    document.getElementById('supplierId').value = supplier.id;
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierContact').value = supplier.contact;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierEmail').value = supplier.email;
  } else {
    title.textContent = 'Add Supplier';
    submitBtn.textContent = 'Add Supplier';
    document.getElementById('supplierId').value = '';
  }
  openModal('supplierModalOverlay');
}
document.getElementById('addSupplierBtn').addEventListener('click', () => openSupplierModal(null));

document.getElementById('supplierForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('supplierId').value;
  const data = {
    name: document.getElementById('supplierName').value.trim(),
    contact: document.getElementById('supplierContact').value.trim(),
    phone: document.getElementById('supplierPhone').value.trim(),
    email: document.getElementById('supplierEmail').value.trim(),
  };
  if (id) {
    Object.assign(db.suppliers.find(s => s.id === id), data);
    showToast('Supplier updated', 'success');
  } else {
    db.suppliers.push({ id: generateId('SUP', db.suppliers), ...data });
    showToast('Supplier added', 'success');
  }
  saveData();
  closeModal('supplierModalOverlay');
  renderAll();
});

/* ---------------------------------------------------------------------- *
 * Reports view
 * ---------------------------------------------------------------------- */
function showReportTab(name) {
  document.querySelectorAll('.report-tab').forEach(t => t.classList.toggle('active', t.dataset.report === name));
  document.querySelectorAll('.report-panel').forEach(p => p.classList.toggle('active', p.id === `report-${name}`));
}
document.querySelectorAll('.report-tab').forEach(tab => {
  tab.addEventListener('click', () => showReportTab(tab.dataset.report));
});

function renderReports() {
  // Summary by category
  const catMap = {};
  db.products.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = { count: 0, stock: 0, value: 0 };
    catMap[p.category].count++;
    catMap[p.category].stock += p.stock;
    catMap[p.category].value += p.stock * p.price;
  });
  const summaryBody = document.getElementById('summaryReportBody');
  summaryBody.innerHTML = Object.entries(catMap).map(([cat, d]) => `
    <tr><td class="cell-strong">${cat}</td><td>${d.count}</td><td>${d.stock}</td><td>${formatCurrency(d.value)}</td></tr>
  `).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--slate-500);">No data available</td></tr>';

  // Low stock report
  const lowStockItems = db.products.filter(p => getStatus(p) !== 'In Stock');
  const lowBody = document.getElementById('lowStockReportBody');
  lowBody.innerHTML = '';
  document.getElementById('lowStockReportEmpty').hidden = lowStockItems.length > 0;
  lowStockItems.forEach(p => {
    const status = getStatus(p);
    lowBody.innerHTML += `<tr>
      <td class="mono">${p.id}</td><td class="cell-strong">${p.name}</td><td>${p.category}</td>
      <td>${p.stock}</td><td>${p.reorder}</td>
      <td><span class="badge ${statusBadgeClass(status)}"><span class="badge-dot"></span>${status}</span></td>
    </tr>`;
  });

  // Movement history (full list)
  const moveBody = document.getElementById('movementReportBody');
  const sorted = [...db.activity].sort((a, b) => new Date(b.date) - new Date(a.date));
  moveBody.innerHTML = sorted.map(a => {
    const p = productById(a.productId);
    return `<tr>
      <td class="mono">${formatDate(a.date)}</td>
      <td class="cell-strong">${p ? p.name : 'Unknown Product'}</td>
      <td><span class="badge ${a.type === 'Stock In' ? 'badge-green' : 'badge-amber'}"><span class="badge-dot"></span>${a.type}</span></td>
      <td>${a.qty}</td><td>${a.reason}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--slate-500);">No movement recorded</td></tr>';
}

/* ---------------------------------------------------------------------- *
 * Master render
 * ---------------------------------------------------------------------- */
function renderAll() {
  renderDashboard();
  renderProducts();
  renderActivity();
  renderSuppliers();
  renderReports();
}

renderAll();
