const checkingBalance = document.getElementById('checkingBalance');
const transferForm = document.getElementById('transferForm');
const transferMessage = document.getElementById('transferMessage');
const transactionList = document.getElementById('transactionList');
const goalsList = document.getElementById('goalsList');
const goalTemplate = document.getElementById('goalTemplate');
const themeToggle = document.getElementById('themeToggle');

let checking = 12850;

const transactions = [
  { label: 'Payroll Deposit', amount: 2450, type: 'credit' },
  { label: 'Coffee Subscription', amount: -14.99, type: 'debit' },
  { label: 'ETF Auto-Invest', amount: -300, type: 'debit' },
  { label: 'Freelance Payout', amount: 620, type: 'credit' },
];

const goals = [
  { name: 'Emergency Fund', current: 6300, target: 10000 },
  { name: 'Vacation in Tokyo', current: 2800, target: 5000 },
  { name: 'New Laptop', current: 1200, target: 2200 },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.slice(0, 6).forEach((txn) => {
    const li = document.createElement('li');
    li.className = 'txn';
    const amountClass = txn.amount >= 0 ? 'credit' : 'debit';
    li.innerHTML = `
      <span>${txn.label}</span>
      <strong class="${amountClass}">${txn.amount >= 0 ? '+' : '-'}${usd.format(Math.abs(txn.amount))}</strong>
    `;
    transactionList.appendChild(li);
  });
}

function renderGoals() {
  goalsList.innerHTML = '';
  goals.forEach((goal) => {
    const node = goalTemplate.content.cloneNode(true);
    const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
    node.querySelector('.goal-name').textContent = goal.name;
    node.querySelector('.goal-progress').textContent = `${progress}%`;
    node.querySelector('.progress-fill').style.width = `${progress}%`;
    goalsList.appendChild(node);
  });
}

transferForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const recipient = document.getElementById('recipient').value.trim();
  const amount = Number(document.getElementById('amount').value);

  if (!recipient || Number.isNaN(amount) || amount <= 0) {
    transferMessage.textContent = 'Please provide a valid recipient and amount.';
    return;
  }

  if (amount > checking) {
    transferMessage.textContent = 'Transfer failed: insufficient checking balance.';
    return;
  }

  checking -= amount;
  checkingBalance.textContent = usd.format(checking);
  transferMessage.textContent = `Payment of ${usd.format(amount)} sent to ${recipient}.`;

  transactions.unshift({
    label: `Sent to ${recipient}`,
    amount: -amount,
    type: 'debit',
  });

  renderTransactions();
  transferForm.reset();
});

function hydrateTheme() {
  const stored = localStorage.getItem('pulsepay-theme');
  const isDark = stored === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('pulsepay-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

hydrateTheme();
renderTransactions();
renderGoals();
