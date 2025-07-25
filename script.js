import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  projectId: "vinayaka-chaturthi-tracker",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const donorListRef = ref(db, 'donors');
const expenseListRef = ref(db, 'expenses');

let isAdmin = false;
const ADMIN_PASSWORD = "vinayaka123";

// DOM elements
const donorName = document.getElementById("donorName");
const donorAmount = document.getElementById("donorAmount");
const expenseItem = document.getElementById("expenseItem");
const expenseAmount = document.getElementById("expenseAmount");
const donorList = document.getElementById("donorList");
const expenseList = document.getElementById("expenseList");
const totalDonations = document.getElementById("totalDonations");
const totalExpenses = document.getElementById("totalExpenses");
const balance = document.getElementById("balance");
const loginMsg = document.getElementById("loginMsg");

function loginAsAdmin() {
  const inputPass = document.getElementById("adminPass").value;
  if (inputPass === ADMIN_PASSWORD) {
    isAdmin = true;
    loginMsg.innerText = "Logged in as Admin ✅";
    document.getElementById("loginSection").style.display = "none";
  } else {
    loginMsg.innerText = "Wrong Password ❌";
  }
}

window.loginAsAdmin = loginAsAdmin;

function addDonor() {
  if (donorName.value && donorAmount.value) {
    push(donorListRef, {
      name: donorName.value,
      amount: Number(donorAmount.value)
    });
    donorName.value = "";
    donorAmount.value = "";
  }
}
window.addDonor = addDonor;

function addExpense() {
  if (expenseItem.value && expenseAmount.value) {
    push(expenseListRef, {
      item: expenseItem.value,
      amount: Number(expenseAmount.value)
    });
    expenseItem.value = "";
    expenseAmount.value = "";
  }
}
window.addExpense = addExpense;

function updateTotalsAndBalance(donors, expenses) {
  const totalDon = donors.reduce((sum, d) => sum + d.amount, 0);
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalDonations.innerText = totalDon;
  totalExpenses.innerText = totalExp;
  balance.innerText = totalDon - totalExp;
}

function renderList(refType, listElement, isDonor) {
  onValue(refType, snapshot => {
    listElement.innerHTML = "";
    const data = snapshot.val() || {};
    const entries = [];
    for (const key in data) {
      const item = data[key];
      entries.push(item);
      const li = document.createElement("li");
      li.textContent = isDonor ? `${item.name} - ₹${item.amount}` : `${item.item} - ₹${item.amount}`;

      if (isAdmin) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "deleteBtn";
        delBtn.onclick = () => remove(ref(db, `${isDonor ? "donors" : "expenses"}/${key}`));
        li.appendChild(delBtn);
      }

      listElement.appendChild(li);
    }

    const donors = isDonor ? entries : [];
    const expenses = isDonor ? [] : entries;
    updateTotalsAndBalance(
      isDonor ? entries : currentDonors,
      isDonor ? currentExpenses : entries
    );

    if (isDonor) currentDonors = entries;
    else currentExpenses = entries;
  });
}

let currentDonors = [], currentExpenses = [];

renderList(donorListRef, donorList, true);
renderList(expenseListRef, expenseList, false);
