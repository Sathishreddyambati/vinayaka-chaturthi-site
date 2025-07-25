let donations = [];
let expenses = [];
const adminPassword = "mmrvinayaka2025";

document.getElementById("adminPass").addEventListener("input", function () {
  if (this.value === adminPassword) {
    document.getElementById("adminForms").style.display = "block";
  } else {
    document.getElementById("adminForms").style.display = "none";
  }
});

function addDonation() {
  const name = document.getElementById("donorName").value;
  const amount = parseFloat(document.getElementById("donorAmount").value);
  if (name && amount) {
    donations.push({ name, amount });
    updateDisplay();
    document.getElementById("donorName").value = "";
    document.getElementById("donorAmount").value = "";
  }
}

function addExpense() {
  const item = document.getElementById("expenseItem").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (item && amount) {
    expenses.push({ item, amount });
    updateDisplay();
    document.getElementById("expenseItem").value = "";
    document.getElementById("expenseAmount").value = "";
  }
}

function deleteDonation(index) {
  donations.splice(index, 1);
  updateDisplay();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateDisplay();
}

function updateDisplay() {
  const totalCollected = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalCollected - totalExpenses;

  document.getElementById("totalCollected").textContent = totalCollected.toFixed(2);
  document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
  document.getElementById("remainingBalance").textContent = remaining.toFixed(2);

  const donorList = document.getElementById("donorList");
  donorList.innerHTML = "";
  donations.forEach((d, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${d.name} - ₹${d.amount.toFixed(2)} <button onclick="deleteDonation(${index})">🗑️</button>`;
    donorList.appendChild(li);
  });

  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  expenses.forEach((e, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${e.item} - ₹${e.amount.toFixed(2)} <button onclick="deleteExpense(${index})">🗑️</button>`;
    expenseList.appendChild(li);
  });
}
