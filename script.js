// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  projectId: "vinayaka-chaturthi-tracker",
  databaseURL: "https://vinayaka-chaturthi-tracker-default-rtdb.firebaseio.com",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d",
  measurementId: "G-7JC384C460"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Auth (Simple) - Only admin can add/delete
let isAdmin = false;
const adminPassword = "admin123";

document.getElementById("adminLoginBtn").addEventListener("click", () => {
  const password = prompt("Enter admin password:");
  if (password === adminPassword) {
    isAdmin = true;
    alert("Admin access granted.");
    document.getElementById("admin-section").style.display = "block";
  } else {
    alert("Wrong password!");
  }
});

// Add Donor
document.getElementById("addDonorBtn").addEventListener("click", () => {
  if (!isAdmin) return alert("Only admin can add donors.");
  const name = document.getElementById("donorName").value;
  const amount = parseInt(document.getElementById("donorAmount").value);
  if (name && amount) {
    push(ref(db, 'donors/'), { name, amount });
    document.getElementById("donorName").value = "";
    document.getElementById("donorAmount").value = "";
  }
});

// Add Expense
document.getElementById("addExpenseBtn").addEventListener("click", () => {
  if (!isAdmin) return alert("Only admin can add expenses.");
  const purpose = document.getElementById("expensePurpose").value;
  const amount = parseInt(document.getElementById("expenseAmount").value);
  if (purpose && amount) {
    push(ref(db, 'expenses/'), { purpose, amount });
    document.getElementById("expensePurpose").value = "";
    document.getElementById("expenseAmount").value = "";
  }
});

// Fetch and show donor list
onValue(ref(db, 'donors/'), (snapshot) => {
  const donorList = document.getElementById("donorList");
  donorList.innerHTML = "";
  let totalDonated = 0;
  snapshot.forEach(child => {
    const data = child.val();
    totalDonated += data.amount;
    const item = document.createElement("li");
    item.textContent = `${data.name} - ₹${data.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.onclick = () => remove(ref(db, `donors/${child.key}`));
      item.appendChild(del);
    }
    donorList.appendChild(item);
  });
  document.getElementById("totalDonated").textContent = `Total Donations: ₹${totalDonated}`;
});

// Fetch and show expense list
onValue(ref(db, 'expenses/'), (snapshot) => {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  let totalSpent = 0;
  snapshot.forEach(child => {
    const data = child.val();
    totalSpent += data.amount;
    const item = document.createElement("li");
    item.textContent = `${data.purpose} - ₹${data.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.onclick = () => remove(ref(db, `expenses/${child.key}`));
      item.appendChild(del);
    }
    expenseList.appendChild(item);
  });
  document.getElementById("totalExpenses").textContent = `Total Expenses: ₹${totalSpent}`;
});

// Net Balance
onValue(ref(db), (snapshot) => {
  const data = snapshot.val() || {};
  const donors = Object.values(data.donors || {});
  const expenses = Object.values(data.expenses || {});
  const total = donors.reduce((sum, d) => sum + d.amount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById("balance").textContent = `Remaining Balance: ₹${total}`;
});
