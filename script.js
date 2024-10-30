// Variables and initial setup
let users = JSON.parse(localStorage.getItem("users")) || [];

// Show specific sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('visible');
    });
    document.getElementById(sectionId).classList.add('visible');
    updateDropdowns(); // Update the dropdowns when switching sections
}

// Load initial data
function loadInitialData() {
    users = [
        { name: 'Alice', email: 'alice@example.com', balance: 500, expenses: [] },
        { name: 'Bob', email: 'bob@example.com', balance: 300, expenses: [] }
    ];
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    updateDropdowns();
}

// Display all users
function displayUsers() {
    let usersList = document.getElementById("usersList");
    usersList.innerHTML = "";
    users.forEach(user => {
        usersList.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.balance}</td>
            </tr>
        `;
    });
}

// Create a new user
function createUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('User already exists');
        return;
    }
    if (!name || !email || !password) {
        alert('All fields are required');
        return;
    }

    users.push({ name, email, balance: 0, expenses: [] });
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    updateDropdowns();  // Update the dropdown with the new user
}

// Update dropdowns with user list
function updateDropdowns() {
    const depositUserDropdown = document.getElementById('depositUserDropdown');
    const withdrawUserDropdown = document.getElementById('withdrawUserDropdown');
    const senderDropdown = document.getElementById('senderDropdown');
    const receiverDropdown = document.getElementById('receiverDropdown');
    const expenseUserDropdown = document.getElementById('expenseUserDropdown');

    // Clear existing options
    depositUserDropdown.innerHTML = '';
    withdrawUserDropdown.innerHTML = '';
    senderDropdown.innerHTML = '';
    receiverDropdown.innerHTML = '';
    expenseUserDropdown.innerHTML = '';

    // Populate dropdowns with users
    users.forEach(user => {
        let option = `<option value="${user.email}">${user.name} (${user.email})</option>`;
        depositUserDropdown.innerHTML += option;
        withdrawUserDropdown.innerHTML += option;
        senderDropdown.innerHTML += option;
        receiverDropdown.innerHTML += option;
        expenseUserDropdown.innerHTML += option;
    });
}

// Deposit money
function deposit() {
    let email = document.getElementById('depositUserDropdown').value;
    let amount = parseFloat(document.getElementById('depositAmount').value);
    
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        alert('User does not exist');
        return;
    }
    if (amount <= 0) {
        alert('Amount must be positive');
        return;
    }

    user.balance += amount;
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
}

// Withdraw money
function withdraw() {
    let email = document.getElementById('withdrawUserDropdown').value;
    let amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        alert('User does not exist');
        return;
    }
    if (amount <= 0) {
        alert('Amount must be positive');
        return;
    }
    if (user.balance < amount) {
        alert('Not enough money');
        return;
    }

    user.balance -= amount;
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
}

// Transfer money
function transfer() {
    let senderEmail = document.getElementById('senderDropdown').value;
    let receiverEmail = document.getElementById('receiverDropdown').value;
    let amount = parseFloat(document.getElementById('transferAmount').value);

    let sender = users.find(u => u.email.toLowerCase() === senderEmail.toLowerCase());
    let receiver = users.find(u => u.email.toLowerCase() === receiverEmail.toLowerCase());

    if (!sender) {
        alert('Sender does not exist');
        return;
    }
    if (!receiver) {
        alert('Receiver does not exist');
        return;
    }
    if (amount <= 0) {
        alert('Amount must be positive');
        return;
    }
    if (sender.balance < amount) {
        alert('Not enough money');
        return;
    }

    sender.balance -= amount;
    receiver.balance += amount;
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
}

// Add expense
function addExpense() {
    let email = document.getElementById('expenseUserDropdown').value;
    let item = document.getElementById('expenseItem').value;
    let amount = parseFloat(document.getElementById('expenseAmount').value);

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        alert('User does not exist');
        return;
    }
    if (!item || amount <= 0) {
        alert('Invalid expense');
        return;
    }

    user.balance -= amount;  // Deduct expense from balance
    user.expenses.push({ item, amount });
    localStorage.setItem('users', JSON.stringify(users));

    listExpenses(user);
}

// List expenses
function listExpenses(user) {
    let expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';
    user.expenses.forEach(exp => {
        expensesList.innerHTML += `<li>${exp.item}: $${exp.amount}</li>`;
    });
}
