
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

const ADMIN_PASSWORD = "vinayaka123";

async function fetchData() {
  const donors = await getDocs(collection(db, "donors"));
  const expenses = await getDocs(collection(db, "expenses"));

  let totalDonations = 0;
  let totalExpenses = 0;

  document.getElementById("donor-list").innerHTML = "";
  document.getElementById("expense-list").innerHTML = "";

  donors.forEach(doc => {
    const data = doc.data();
    totalDonations += Number(data.amount);
    const li = document.createElement("li");
    li.textContent = `${data.name} - ₹${data.amount}`;
    document.getElementById("donor-list").appendChild(li);
  });

  expenses.forEach(doc => {
    const data = doc.data();
    totalExpenses += Number(data.amount);
    const li = document.createElement("li");
    li.textContent = `${data.name} - ₹${data.amount}`;
    document.getElementById("expense-list").appendChild(li);
  });

  document.getElementById("total-donations").textContent = totalDonations;
  document.getElementById("total-expenses").textContent = totalExpenses;
  document.getElementById("balance").textContent = totalDonations - totalExpenses;
}

window.login = () => {
  const password = document.getElementById("admin-password").value;
  if (password === ADMIN_PASSWORD) {
    document.getElementById("admin-controls").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
};

window.addDonor = async () => {
  const name = document.getElementById("donor-name").value;
  const amount = document.getElementById("donor-amount").value;
  if (name && amount) {
    await addDoc(collection(db, "donors"), { name, amount });
    fetchData();
    document.getElementById("donor-name").value = "";
    document.getElementById("donor-amount").value = "";
  } else {
    alert("Please enter both name and amount!");
  }
};

window.addExpense = async () => {
  const name = document.getElementById("expense-name").value;
  const amount = document.getElementById("expense-amount").value;
  if (name && amount) {
    await addDoc(collection(db, "expenses"), { name, amount });
    fetchData();
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
  } else {
    alert("Please enter both description and amount!");
  }
};

fetchData();
