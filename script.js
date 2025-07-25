// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  projectId: "vinayaka-chaturthi-tracker",
  storageBucket: "vinayaka-chaturthi-tracker.firebasestorage.app",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d",
  measurementId: "G-7JC384C460"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ---- App logic ---- //
let donors = [];
let expenses = [];
let isAdmin = false;

function updateDisplay() {
  const donorList = document.getElementById("donor-list");
  const expenseList = document.getElementById("expense-list");
  const totalAmount = document.getElementById("total-amount");
  const totalSpent = document.getElementById("total-spent");
  const balanceAmount = document.getElementById("balance-amount");

  donorList.innerHTML = "";
  expenseList.innerHTML = "";

  let total = 0;
  let spent = 0;

  donors.forEach((donor, index) => {
    const li = document.createElement("li");
    li.textContent = `${donor.name}: ₹${donor.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "🗑️";
      del.onclick = () => {
        donors.splice(index, 1);
        updateDisplay();
      };
      li.appendChild(del);
    }
    donorList.appendChild(li);
    total += parseFloat(donor.amount);
  });

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.textContent = `${expense.purpose}: ₹${expense.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "🗑️";
      del.onclick = () => {
        expenses.splice(index, 1);
        updateDisplay();
      };
      li.appendChild(del);
    }
    expenseList.appendChild(li);
    spent += parseFloat(expense.amount);
  });

  totalAmount.textContent = `₹${total}`;
  totalSpent.textContent = `₹${spent}`;
  balanceAmount.textContent = `₹${total - spent}`;
}

document.getElementById("donor-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("donor-name").value;
  const amount = document.getElementById("donor-amount").value;
  if (name && amount) {
    donors.push({ name, amount });
    updateDisplay();
    this.reset();
  }
});

document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const purpose = document.getElementById("expense-purpose").value;
  const amount = document.getElementById("expense-amount").value;
  if (purpose && amount) {
    expenses.push({ purpose, amount });
    updateDisplay();
    this.reset();
  }
});

document.getElementById("admin-login").addEventListener("submit", function (e) {
  e.preventDefault();
  const password = document.getElementById("admin-password").value;
  if (password === "admin123") {
    isAdmin = true;
    document.getElementById("admin-section").style.display = "block";
    alert("Admin access granted ✅");
    updateDisplay();
  } else {
    alert("Wrong password ❌");
  }
  this.reset();
});

updateDisplay();
