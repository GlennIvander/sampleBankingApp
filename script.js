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
    const initialUsers = [
        { name: 'Phoebe', email: 'phoebe@example.com', balance: 500, expenses: [] },
        { name: 'Glenn', email: 'glenn@example.com', balance: 300, expenses: [] }
    ];

    initialUsers.forEach(initialUser => {
        if (!users.some(user => user.email.toLowerCase() === initialUser.email.toLowerCase())) {
            users.push(initialUser);
        }
    });

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
                <td><button onclick="deactivateUser('${user.email}')">Deactivate</button></td>
            </tr>
        `;
    });
    updateDropdowns();
}

// Load user for editing
function loadUserForEdit(email) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        document.getElementById('editUserDropdown').innerHTML = `<option value="${user.email}">${user.name} (${user.email})</option>`;
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
    }
}

// Create User
function createUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name.trim() || !email.trim() || !password.trim()) {
        showNotification('All fields must be filled.');
        return;
    }

    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        showNotification('Email already exists.');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        balance: 0, // Assuming new users start with a balance of 0
        expenses: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    showNotification('User created successfully!');
    clearCreateUserForm(); // Optional: Function to reset the form fields
}

function clearCreateUserForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// Edit user details
function editUser() {
    const email = document.getElementById('editUserDropdown').value;
    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        user.name = newName || user.name;
        user.email = newEmail || user.email;

        // Update local storage and UI
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
        showNotification('User details updated successfully!');
    }
}

// Deactivate user
function deactivateUser(email) {
    users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    showNotification('User deactivated successfully!');
}


// Add expense
function addExpense() {
    let email = document.getElementById('expenseUserDropdown').value;
    let item = document.getElementById('expenseItem').value;
    let amount = parseFloat(document.getElementById('expenseAmount').value);

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        showNotification('User does not exist');
        return;
    }
    if (!item || amount <= 0) {
        showNotification('Invalid expense');
        return;
    }
    
    // Check if balance is sufficient
    if (user.balance < amount) {
        showNotification('Insufficient funds for this expense.');
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
    user.expenses.forEach((exp, index) => {
        expensesList.innerHTML += `<li>${exp.item}: PHP${exp.amount} <button onclick="deleteExpense('${user.email}', ${index})">Delete</button></li>`;
    });
}

// Delete expense
function deleteExpense(userEmail, index) {
    let user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (user && user.expenses.length > index) {
        user.expenses.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        listExpenses(user);
        showNotification('Expense deleted successfully!');
    }
}

// Deposit
function deposit() {
    const email = document.getElementById('depositUserDropdown').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        showNotification('User does not exist');
        return;
    }
    if (amount <= 0) {
        showNotification('Invalid deposit amount');
        return;
    }

    user.balance += amount; // Add amount to user balance
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(); // Refresh user display
    showNotification(`Deposited PHP${amount} to ${user.name}'s account.`);
}

// Withdraw
function withdraw() {
    const email = document.getElementById('withdrawUserDropdown').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        showNotification('User does not exist');
        return;
    }
    if (amount <= 0) {
        showNotification('Invalid withdrawal amount');
        return;
    }
    if (user.balance < amount) {
        showNotification('Insufficient balance for this withdrawal.');
        return;
    }

    user.balance -= amount; // Deduct amount from user balance
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(); // Refresh user display
    showNotification(`Withdrew PHP${amount} from ${user.name}'s account.`);
}

// Transfer
function transfer() {
    const senderEmail = document.getElementById('senderDropdown').value;
    const receiverEmail = document.getElementById('receiverDropdown').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);

    let sender = users.find(u => u.email.toLowerCase() === senderEmail.toLowerCase());
    let receiver = users.find(u => u.email.toLowerCase() === receiverEmail.toLowerCase());
    if (!sender) {
        showNotification('Sender does not exist');
        return;
    }
    if (!receiver) {
        showNotification('Receiver does not exist');
        return;
    }
    if (amount <= 0) {
        showNotification('Invalid transfer amount');
        return;
    }
    if (sender.balance < amount) {
        showNotification('Insufficient balance for this transfer.');
        return;
    }

    sender.balance -= amount; // Deduct from sender
    receiver.balance += amount; // Add to receiver
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(); // Refresh user display
    showNotification(`Transferred PHP${amount} from ${sender.name} to ${receiver.name}.`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000); // Remove notification after 3 seconds
}

// Update dropdowns with user list
function updateDropdowns() {
    const depositUserDropdown = document.getElementById('depositUserDropdown');
    const withdrawUserDropdown = document.getElementById('withdrawUserDropdown');
    const senderDropdown = document.getElementById('senderDropdown');
    const receiverDropdown = document.getElementById('receiverDropdown');
    const expenseUserDropdown = document.getElementById('expenseUserDropdown');
    const editUserDropdown = document.getElementById('editUserDropdown');

    // Clear existing options
    depositUserDropdown.innerHTML = '';
    withdrawUserDropdown.innerHTML = '';
    senderDropdown.innerHTML = '';
    receiverDropdown.innerHTML = '';
    expenseUserDropdown.innerHTML = '';
    editUserDropdown.innerHTML = '';

    // Populate dropdowns with users
    users.forEach(user => {
        let option = `<option value="${user.email}">${user.name} (${user.email})</option>`;
        depositUserDropdown.innerHTML += option;
        withdrawUserDropdown.innerHTML += option;
        senderDropdown.innerHTML += option;
        receiverDropdown.innerHTML += option;
        expenseUserDropdown.innerHTML += option;
        editUserDropdown.innerHTML += option;
    });
}
