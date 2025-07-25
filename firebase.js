// ✅ Replace below with your Firebase config (from your project)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mmr-vinayaka.firebaseapp.com",
  projectId: "mmr-vinayaka",
  storageBucket: "mmr-vinayaka.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ADMIN_PASSWORD = "mmr@2025";
let isAdmin = false;

function checkLogin() {
  const entered = document.getElementById("adminPassword").value;
  if (entered === ADMIN_PASSWORD) {
    document.getElementById("adminControls").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    isAdmin = true;
  } else {
    document.getElementById("loginError").textContent = "Incorrect password!";
  }
}

function updateTotals(donors, expenses) {
  const total = donors.reduce((sum, d) => sum + d.amount, 0);
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById("totalCollection").textContent = total;
  document.getElementById("totalExpenses").textContent = spent;
  document.getElementById("remainingAmount").textContent = total - spent;
}

function renderData() {
  db.collection("donors").onSnapshot(snapshot => {
    const donorList = document.getElementById("donorList");
    donorList.innerHTML = "";
    let donors = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      donors.push({ id: doc.id, ...data });
      const li = document.createElement("li");
      li.textContent = `${data.name} - ₹${data.amount}`;
      if (isAdmin) {
        li.innerHTML += ` <span class="edit-delete" onclick="deleteDonor('${doc.id}')">❌</span>`;
      }
      donorList.appendChild(li);
    });
    updateTotals(donors, window.expenses || []);
  });

  db.collection("expenses").onSnapshot(snapshot => {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";
    let expenses = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      expenses.push({ id: doc.id, ...data });
      const li = document.createElement("li");
      li.textContent = `${data.desc} - ₹${data.amount}`;
      if (isAdmin) {
        li.innerHTML += ` <span class="edit-delete" onclick="deleteExpense('${doc.id}')">❌</span>`;
      }
      expenseList.appendChild(li);
    });
    window.expenses = expenses;
    updateTotals(window.donors || [], expenses);
  });
}

function addDonor() {
  const name = document.getElementById("donorName").value.trim();
  const amount = parseInt(document.getElementById("donorAmount").value);
  if (name && amount) {
    db.collection("donors").add({ name, amount });
    document.getElementById("donorName").value = "";
    document.getElementById("donorAmount").value = "";
  }
}

function addExpense() {
  const desc = document.getElementById("expenseDesc").value.trim();
  const amount = parseInt(document.getElementById("expenseAmount").value);
  if (desc && amount) {
    db.collection("expenses").add({ desc, amount });
    document.getElementById("expenseDesc").value = "";
    document.getElementById("expenseAmount").value = "";
  }
}

function deleteDonor(id) {
  if (confirm("Delete this donor?")) {
    db.collection("donors").doc(id).delete();
  }
}

function deleteExpense(id) {
  if (confirm("Delete this expense?")) {
    db.collection("expenses").doc(id).delete();
  }
}

renderData();
