const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  projectId: "vinayaka-chaturthi-tracker",
  databaseURL: "https://vinayaka-chaturthi-tracker-default-rtdb.firebaseio.com",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const donorsRef = db.ref("donors");
const expensesRef = db.ref("expenses");

function updateTotals() {
  donorsRef.once("value", snapshot => {
    let total = 0;
    snapshot.forEach(child => {
      total += parseFloat(child.val().amount || 0);
    });
    document.getElementById("total-donated").textContent = total;
    updateRemaining();
  });

  expensesRef.once("value", snapshot => {
    let total = 0;
    snapshot.forEach(child => {
      total += parseFloat(child.val().amount || 0);
    });
    document.getElementById("total-expenses").textContent = total;
    updateRemaining();
  });
}

function updateRemaining() {
  const donated = parseFloat(document.getElementById("total-donated").textContent || "0");
  const spent = parseFloat(document.getElementById("total-expenses").textContent || "0");
  const remaining = donated - spent;
  document.getElementById("remaining-amount").textContent = remaining;
}

function renderLists() {
  donorsRef.on("value", snapshot => {
    const list = document.getElementById("donors-list");
    list.innerHTML = "";
    snapshot.forEach(child => {
      const li = document.createElement("li");
      li.textContent = `${child.val().name}: ₹${child.val().amount}`;
      list.appendChild(li);
    });
    updateTotals();
  });

  expensesRef.on("value", snapshot => {
    const list = document.getElementById("expenses-list");
    list.innerHTML = "";
    snapshot.forEach(child => {
      const li = document.createElement("li");
      li.textContent = `${child.val().purpose}: ₹${child.val().amount}`;
      list.appendChild(li);
    });
    updateTotals();
  });
}

function login() {
  const pass = document.getElementById("admin-password").value;
  if (pass === "mmradmin") {
    document.getElementById("admin-controls").style.display = "block";
    document.getElementById("admin-login").style.display = "none";
  } else {
    alert("Wrong password!");
  }
}

function showDonorForm() {
  const form = `
    <h3>Add Donor</h3>
    <input type="text" id="donor-name" placeholder="Name"/><br/>
    <input type="number" id="donor-amount" placeholder="Amount"/><br/>
    <button onclick="addDonor()">Submit</button>
  `;
  document.getElementById("form-container").innerHTML = form;
}

function showExpenseForm() {
  const form = `
    <h3>Add Expense</h3>
    <input type="text" id="expense-purpose" placeholder="Purpose"/><br/>
    <input type="number" id="expense-amount" placeholder="Amount"/><br/>
    <button onclick="addExpense()">Submit</button>
  `;
  document.getElementById("form-container").innerHTML = form;
}

function addDonor() {
  const name = document.getElementById("donor-name").value;
  const amount = parseFloat(document.getElementById("donor-amount").value);
  if (!name || !amount) return alert("Fill all fields!");
  donorsRef.push({ name, amount });
  document.getElementById("form-container").innerHTML = "";
}

function addExpense() {
  const purpose = document.getElementById("expense-purpose").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  if (!purpose || !amount) return alert("Fill all fields!");
  expensesRef.push({ purpose, amount });
  document.getElementById("form-container").innerHTML = "";
}

renderLists();