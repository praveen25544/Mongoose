// --- Snow Effect -------------------------------------------------------------
const snowContainer = document.getElementById('snow-container');
for (let i = 0; i < 60; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = (5 + Math.random() * 10) + 's';
    snowflake.style.fontSize = (10 + Math.random() * 20) + 'px';
    snowContainer.appendChild(snowflake);
}

// --- Data handling -----------------------------------------------------------
let expenses = [];

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const data = localStorage.getItem('expenses');
    if (data) {
        expenses = JSON.parse(data);
    }
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// --- Rendering ---------------------------------------------------------------
function renderTable(filtered = null) {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';

    const list = filtered || expenses;
    if (list.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.style.textAlign = 'center';
        cell.style.opacity = '0.6';
        cell.textContent = 'No expenses added yet.';
    } else {
        list.forEach(exp => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = exp.description;
            row.insertCell(1).textContent = parseFloat(exp.amount).toFixed(2);
            row.insertCell(2).textContent = exp.date;
            const actionCell = row.insertCell(3);
            const del = document.createElement('button');
            del.textContent = 'Delete';
            del.className = 'delete-btn';
            del.addEventListener('click', () => removeExpense(exp.id));
            actionCell.appendChild(del);
            // animate
            row.classList.add('new-row');
        });
    }

    calculateTotal(list);
}

function calculateTotal(list) {
    const total = list.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

// --- CRUD operations ---------------------------------------------------------
function addExpense() {
    const descEl = document.getElementById('description');
    const amtEl = document.getElementById('amount');
    const dateEl = document.getElementById('date');

    const desc = descEl.value.trim();
    const amt = amtEl.value.trim();
    const date = dateEl.value;

    if (!desc || !amt || !date) {
        alert('Please fill all fields');
        return;
    }

    if (parseFloat(amt) <= 0) {
        alert('Amount must be positive');
        return;
    }

    const expense = {
        id: generateId(),
        description: desc,
        amount: amt,
        date: date
    };

    expenses.push(expense);
    saveExpenses();
    renderTable();

    descEl.value = '';
    amtEl.value = '';
    dateEl.value = '';
}

function removeExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    renderTable();
}

// --- Filtering ---------------------------------------------------------------
document.getElementById('filter-btn').addEventListener('click', () => {
    const from = document.getElementById('from-date').value;
    const to = document.getElementById('to-date').value;
    let filtered = expenses;
    if (from) filtered = filtered.filter(e => e.date >= from);
    if (to) filtered = filtered.filter(e => e.date <= to);
    renderTable(filtered);
});

document.getElementById('clear-filter-btn').addEventListener('click', () => {
    document.getElementById('from-date').value = '';
    document.getElementById('to-date').value = '';
    renderTable();
});

// --- Event bindings ----------------------------------------------------------
document.getElementById('add-btn').addEventListener('click', addExpense);
// submit on Enter
['description','amount','date'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') addExpense();
    });
});

// --- Theme handling ---------------------------------------------------------
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    themeToggle.textContent = theme === 'light' ? '🌙' : '🌞';
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const t = localStorage.getItem('theme');
    applyTheme(t === 'light' ? 'light' : 'dark');
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
});

// --- Initialization ---------------------------------------------------------
loadTheme();
loadExpenses();
renderTable();

// Ensure table updates when the page loads, even if storage empty.

