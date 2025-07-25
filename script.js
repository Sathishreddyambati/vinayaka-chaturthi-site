import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  projectId: "vinayaka-chaturthi-tracker",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d",
  measurementId: "G-7JC384C460"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const donorRef = ref(db, "donors");
const expenseRef = ref(db, "expenses");

let isAdmin = false;
const ADMIN_KEY = "vinayaka2025"; // change this secret if needed

// Admin login
window.checkAdmin = () => {
  const key = document.getElementById("admin-key").value;
  if (key === ADMIN_KEY) {
    isAdmin = true;
    document.getElementById("forms").style.display = "block";
    alert("Admin Access Granted");
  } else {
    alert("Incorrect Key");
  }
};

// Add Donor
window.addDonor = () => {
  const name = document.getElementById("donor-name").value.trim();
  const amount = parseInt(document.getElementById("donor-amount").value);
  if (name && amount > 0) {
    push(donorRef, { name, amount });
    document.getElementById("donor-name").value = "";
    document.getElementById("donor-amount").value = "";
  }
};

// Add Expense
window.addExpense = () => {
  const desc = document.getElementById("expense-desc").value.trim();
  const amount = parseInt(document.getElementById("expense-amount").value);
  if (desc && amount > 0) {
    push(expenseRef, { desc, amount });
    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
  }
};

// Load Donors
onValue(donorRef, (snapshot) => {
  const donorList = document.getElementById("donor-list");
  donorList.innerHTML = "";
  let totalDonated = 0;
  snapshot.forEach(child => {
    const data = child.val();
    totalDonated += data.amount;
    const li = document.createElement("li");
    li.innerHTML = `${data.name}: ₹${data.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.innerText = "X";
      del.className = "delete-btn";
      del.onclick = () => remove(ref(db, `donors/${child.key}`));
      li.appendChild(del);
    }
    donorList.appendChild(li);
  });
  document.getElementById("total-donated").innerText = totalDonated;
  updateBalance();
});

// Load Expenses
onValue(expenseRef, (snapshot) => {
  const expenseList = document.getElementById("expense-list");
  expenseList.innerHTML = "";
  let totalSpent = 0;
  snapshot.forEach(child => {
    const data = child.val();
    totalSpent += data.amount;
    const li = document.createElement("li");
    li.innerHTML = `${data.desc}: ₹${data.amount}`;
    if (isAdmin) {
      const del = document.createElement("button");
      del.innerText = "X";
      del.className = "delete-btn";
      del.onclick = () => remove(ref(db, `expenses/${child.key}`));
      li.appendChild(del);
    }
    expenseList.appendChild(li);
  });
  document.getElementById("total-spent").innerText = totalSpent;
  updateBalance();
});

// Update balance
function updateBalance() {
  const donated = parseInt(document.getElementById("total-donated").innerText) || 0;
  const spent = parseInt(document.getElementById("total-spent").innerText) || 0;
  document.getElementById("balance").innerText = donated - spent;
  }
