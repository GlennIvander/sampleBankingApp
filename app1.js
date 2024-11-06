// Select elements
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetAmountDisplay = document.getElementById("budget-amount");
const budgetFeedback = document.querySelector(".budget-feedback");

// Function to update the budget amount
function updateBudget() {
    const budgetValue = parseFloat(budgetInput.value);

    // Check if the input is a valid number and greater than zero
    if (isNaN(budgetValue) || budgetValue <= 0) {
        budgetFeedback.textContent = "Please enter a valid budget amount.";
        budgetFeedback.style.display = "block"; // Show feedback
        setTimeout(() => {
            budgetFeedback.style.display = "none"; // Hide feedback after 3 seconds
        }, 3000);
    } else {
        // Update budget amount display and hide feedback
        budgetAmountDisplay.textContent = budgetValue.toFixed(2);
        budgetFeedback.style.display = "none";
    }

    // Clear the input field
    budgetInput.value = "";
}

// Event listener for budget form submission
budgetForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    updateBudget(); // Call the function to update the budget
});

// Select elements for the expense form
const expenseForm = document.getElementById("expense-form");
const expenseNameInput = document.getElementById("expense-input");
const expenseAmountInput = document.getElementById("amount-input");
const expenseList = document.getElementById("expense-list");
const expenseFeedback = document.querySelector(".expense-feedback");

// Function to add an expense item to the list
function addExpense() {
    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value);

    // Validate input
    if (expenseName === "" || isNaN(expenseAmount) || expenseAmount <= 0) {
        expenseFeedback.textContent = "Please enter a valid name and amount for the expense.";
        expenseFeedback.style.display = "block"; // Show feedback
        setTimeout(() => {
            expenseFeedback.style.display = "none"; // Hide feedback after 3 seconds
        }, 3000);
    } else {
        // Create expense item container
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("d-flex", "justify-content-between", "text-capitalize", "my-2");

        // Add expense name and amount to the item
        expenseItem.innerHTML = `
            <h5 class="expense-title mb-0">${expenseName}</h5>
            <h5 class="expense-amount mb-0">$${expenseAmount.toFixed(2)}</h5>
            <div>
                <a href="#" class="edit-icon mx-2"><i class="fas fa-edit"></i></a>
                <a href="#" class="delete-icon"><i class="fas fa-trash"></i></a>
            </div>
        `;

        // Append the expense item to the expense list
        expenseList.appendChild(expenseItem);

        // Clear input fields
        expenseNameInput.value = "";
        expenseAmountInput.value = "";
    }
}

// Event listener for expense form submission
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    addExpense(); // Call the function to add an expense
});

// Select elements for the app info
const expenseAmountDisplay = document.getElementById("expense-amount");

let totalExpenses = 0; // Variable to keep track of total expenses

// Function to add an expense item to the list and update the total expenses
function addExpense() {
    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value);

    // Validate input
    if (expenseName === "" || isNaN(expenseAmount) || expenseAmount <= 0) {
        expenseFeedback.textContent = "Please enter a valid name and amount for the expense.";
        expenseFeedback.style.display = "block"; // Show feedback
        setTimeout(() => {
            expenseFeedback.style.display = "none"; // Hide feedback after 3 seconds
        }, 3000);
    } else {
        // Update total expenses
        totalExpenses += expenseAmount;
        updateExpenseAmountDisplay();

        // Create expense item container
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("d-flex", "justify-content-between", "text-capitalize", "my-2");

        // Add expense name and amount to the item
        expenseItem.innerHTML = `
            <h5 class="expense-title mb-0">${expenseName}</h5>
            <h5 class="expense-amount mb-0">$${expenseAmount.toFixed(2)}</h5>
            <div>
                <a href="#" class="edit-icon mx-2"><i class="fas fa-edit"></i></a>
                <a href="#" class="delete-icon"><i class="fas fa-trash"></i></a>
            </div>
        `;

        // Append the expense item to the expense list
        expenseList.appendChild(expenseItem);

        // Clear input fields
        expenseNameInput.value = "";
        expenseAmountInput.value = "";
    }
}

// Function to update the expense amount display
function updateExpenseAmountDisplay() {
    expenseAmountDisplay.textContent = totalExpenses.toFixed(2); // Display updated total expenses
}

// Event listener for expense form submission
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    addExpense(); // Call the function to add an expense
});
