import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  databaseURL: "https://vinayaka-chaturthi-tracker-default-rtdb.firebaseio.com",
  projectId: "vinayaka-chaturthi-tracker",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d",
  measurementId: "G-7JC384C460"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const donationsRef = ref(database, 'donations');
const expensesRef = ref(database, 'expenses');

function updateSummary() {
  onValue(donationsRef, snapshot => {
    let total = 0;
    snapshot.forEach(child => total += child.val().amount);
    document.getElementById("totalDonations").innerText = total;

    onValue(expensesRef, snap => {
      let totalExp = 0;
      snap.forEach(child => totalExp += child.val().amount);
      document.getElementById("totalExpenses").innerText = totalExp;
      document.getElementById("balance").innerText = total - totalExp;
    });
  });
}

function renderList(refPath, listId, type) {
  onValue(refPath, snapshot => {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    snapshot.forEach(child => {
      const li = document.createElement("li");
      li.textContent = `${child.val().name} - ₹${child.val().amount}`;
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => remove(ref(database, `${type}/${child.key}`));
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  });
}

window.addDonation = function () {
  const name = document.getElementById("donorName").value.trim();
  const amount = parseInt(document.getElementById("donationAmount").value);
  if (name && amount > 0) {
    push(donationsRef, { name, amount });
    document.getElementById("donorName").value = "";
    document.getElementById("donationAmount").value = "";
  }
};

window.addExpense = function () {
  const name = document.getElementById("expenseName").value.trim();
  const amount = parseInt(document.getElementById("expenseAmount").value);
  if (name && amount > 0) {
    push(expensesRef, { name, amount });
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
  }
};

updateSummary();
renderList(donationsRef, "donationsList", "donations");
renderList(expensesRef, "expensesList", "expenses");
