
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const PASSWORD = "mmradmin";
let isAdmin = false;

async function fetchData() {
    const donorsSnap = await getDocs(collection(db, "donors"));
    const expensesSnap = await getDocs(collection(db, "expenses"));

    let totalDonations = 0;
    let totalExpenses = 0;

    const donorsList = document.getElementById("donors-list");
    const expensesList = document.getElementById("expenses-list");
    donorsList.innerHTML = "";
    expensesList.innerHTML = "";

    donorsSnap.forEach(docSnap => {
        const data = docSnap.data();
        totalDonations += data.amount;
        const li = document.createElement("li");
        li.textContent = `${data.name}: ₹${data.amount}`;
        donorsList.appendChild(li);
    });

    expensesSnap.forEach(docSnap => {
        const data = docSnap.data();
        totalExpenses += data.amount;
        const li = document.createElement("li");
        li.textContent = `${data.description}: ₹${data.amount}`;
        expensesList.appendChild(li);
    });

    document.getElementById("total-donations").textContent = totalDonations;
    document.getElementById("total-expenses").textContent = totalExpenses;
    document.getElementById("balance").textContent = totalDonations - totalExpenses;
}

window.login = function () {
    const pwd = document.getElementById("admin-password").value;
    if (pwd === PASSWORD) {
        isAdmin = true;
        document.getElementById("admin-controls").style.display = "block";
        alert("Admin logged in!");
    } else {
        alert("Incorrect password!");
    }
};

window.addDonor = async function () {
    if (!isAdmin) return;
    const name = document.getElementById("donor-name").value;
    const amount = parseFloat(document.getElementById("donor-amount").value);
    if (!name || isNaN(amount)) return alert("Fill both fields correctly");
    await addDoc(collection(db, "donors"), { name, amount });
    fetchData();
};

window.addExpense = async function () {
    if (!isAdmin) return;
    const description = document.getElementById("expense-desc").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    if (!description || isNaN(amount)) return alert("Fill both fields correctly");
    await addDoc(collection(db, "expenses"), { description, amount });
    fetchData();
};

fetchData();
