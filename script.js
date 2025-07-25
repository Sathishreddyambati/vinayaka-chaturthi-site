
const firebaseConfig = {
  apiKey: "AIzaSyDpTK6EM2jKQLgZBDkEGW90Bm8LvhAV58Y",
  authDomain: "vinayaka-chaturthi-tracker.firebaseapp.com",
  databaseURL: "https://vinayaka-chaturthi-tracker-default-rtdb.firebaseio.com",
  projectId: "vinayaka-chaturthi-tracker",
  storageBucket: "vinayaka-chaturthi-tracker.appspot.com",
  messagingSenderId: "74803522072",
  appId: "1:74803522072:web:9b3572e9b1b46b936e716d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const donorList = document.getElementById("donorList");
const expenseList = document.getElementById("expenseList");
const totalDonations = document.getElementById("totalDonations");
const totalExpenses = document.getElementById("totalExpenses");

function renderList(refPath, listElement, totalElement) {
  db.ref(refPath).on("value", snapshot => {
    let data = snapshot.val();
    listElement.innerHTML = "";
    let total = 0;
    for (let id in data) {
      let item = data[id];
      total += parseFloat(item.amount);
      let li = document.createElement("li");
      li.textContent = refPath === "donors" ? `${item.name}: ₹${item.amount}` : `${item.reason}: ₹${item.amount}`;
      listElement.appendChild(li);
    }
    totalElement.textContent = total;
  });
}

renderList("donors", donorList, totalDonations);
renderList("expenses", expenseList, totalExpenses);

function login() {
  const pass = document.getElementById("adminPassword").value;
  if (pass === "mmradmin123") {
    document.getElementById("adminControls").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
  } else {
    document.getElementById("loginError").textContent = "Incorrect password!";
  }
}

function addDonor() {
  const name = document.getElementById("donorName").value;
  const amount = document.getElementById("donorAmount").value;
  if (!name || !amount) return alert("Please enter both name and amount.");
  db.ref("donors").push({ name, amount });
  document.getElementById("donorName").value = "";
  document.getElementById("donorAmount").value = "";
}

function addExpense() {
  const reason = document.getElementById("expenseReason").value;
  const amount = document.getElementById("expenseAmount").value;
  if (!reason || !amount) return alert("Please enter both reason and amount.");
  db.ref("expenses").push({ reason, amount });
  document.getElementById("expenseReason").value = "";
  document.getElementById("expenseAmount").value = "";
}
