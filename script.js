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
        { name: 'Glenn', email: 'glenn@email.com', balance: 60000, expenses: [] },
        { name: 'Pheebs', email: 'pheebs@email.com', balance: 50000, expenses: [] }
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
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!name.trim() || !email.trim() || !password.trim()) {
            showNotification('All fields must be filled.');
            return;
        }

        if (!isValidName(name)) {
            showNotification('Name cannot start with a number.');
            return;
        }

        if (userAlreadyExists(email)) {
            showNotification('User already exists');
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
        clearCreateUserForm();
    } catch (error) {
        handleError(error, "Failed to create user.");
    }
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
    try {
        users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
        showNotification('User deactivated successfully!');
    } catch (error) {
        handleError(error, "Failed to deactivate user.");
    }
}

// Add expense
function addExpense() {
    try {
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
    } catch (error) {
        handleError(error, "Failed to add expense.");
    }
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
    try {
        let user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
        if (user && user.expenses.length > index) {
            user.expenses.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            listExpenses(user);
            showNotification('Expense deleted successfully!');
        }
    } catch (error) {
        handleError(error, "Failed to delete expense.");
    }
}

// Deposit
function deposit() {
    try {
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
    } catch (error) {
        handleError(error, "Failed to deposit.");
    }
}

// Withdraw
function withdraw() {
    try {
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
    } catch (error) {
        handleError(error, "Failed to withdraw.");
    }
}

// Transfer function with same account validation
function transfer() {
    const senderEmail = document.getElementById('senderDropdown').value;
    const receiverEmail = document.getElementById('receiverDropdown').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);

    let sender = users.find(u => u.email.toLowerCase() === senderEmail.toLowerCase());
    let receiver = users.find(u => u.email.toLowerCase() === receiverEmail.toLowerCase());

    // Validate that sender and receiver are not the same
    if (senderEmail.toLowerCase() === receiverEmail.toLowerCase()) {
        showNotification("Cannot transfer to the same account.");
        return;
    }

    // Validate sender and receiver existence
    if (!sender) {
        showNotification('Sender does not exist.');
        return;
    }
    if (!receiver) {
        showNotification('Receiver does not exist.');
        return;
    }

    // Validate transfer amount
    if (amount <= 0) {
        showNotification('Invalid transfer amount.');
        return;
    }
    if (sender.balance < amount) {
        showNotification('Insufficient balance for this transfer.');
        return;
    }

    // Process the transfer
    sender.balance -= amount; // Deduct from sender
    receiver.balance += amount; // Add to receiver
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(); // Refresh user display
    showNotification(`Transferred PHP${amount} from ${sender.name} to ${receiver.name}.`);
}


// Show notification
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("visible");
    setTimeout(() => {
        notification.classList.remove("visible");
    }, 3000); // Hide notification after 3 seconds
}

// Handle errors
function handleError(error, context) {
    console.error(`${context}: ${error.message || error}`);
    showNotification(`Error: ${context}`);
}

// Check if name is valid (does not start with a number)
function isValidName(name) {
    return !/^\d/.test(name);
}

// Check if user already exists
function userAlreadyExists(email) {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Update dropdowns
function updateDropdowns() {
    const depositDropdown = document.getElementById("depositUserDropdown");
    const withdrawDropdown = document.getElementById("withdrawUserDropdown");
    const transferSenderDropdown = document.getElementById("senderDropdown");
    const transferReceiverDropdown = document.getElementById("receiverDropdown");
    const expenseDropdown = document.getElementById("expenseUserDropdown");
    const editUserDropdown = document.getElementById('editUserDropdown');

    const allUserEmails = users.map(user => user.email);

    const dropdowns = [depositDropdown, withdrawDropdown, transferSenderDropdown, transferReceiverDropdown, expenseDropdown,editUserDropdown];

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = `<option value="">Select User</option>`;
        allUserEmails.forEach(email => {
            dropdown.innerHTML += `<option value="${email}">${email}</option>`;
        });
    });
}

// Initialize the app with data
loadInitialData();
