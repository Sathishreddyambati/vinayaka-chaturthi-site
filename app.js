import {{ initializeApp }} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {{ getFirestore, collection, addDoc, getDocs, deleteDoc, doc }} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const password = "mmradmin";  // only this password needed for all actions

document.getElementById("donorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("donorName").value;
  const amount = parseInt(document.getElementById("donorAmount").value);
  await addDoc(collection(db, "donors"), {{ name, amount }});
  location.reload();
});

document.getElementById("expenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("expenseName").value;
  const amount = parseInt(document.getElementById("expenseAmount").value);
  await addDoc(collection(db, "expenses"), {{ name, amount }});
  location.reload();
});

async function loadData() {{
  const donorList = document.getElementById("donorList");
  const expenseList = document.getElementById("expenseList");
  donorList.innerHTML = "";
  expenseList.innerHTML = "";

  let totalDonations = 0, totalExpenses = 0;

  const donorsSnap = await getDocs(collection(db, "donors"));
  donorsSnap.forEach((docSnap) => {{
    const data = docSnap.data();
    totalDonations += data.amount;
    const li = document.createElement("li");
    li.textContent = `${{data.name}} - ₹${{data.amount}}`;
    if (isAdmin) {{
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {{
        await deleteDoc(doc(db, "donors", docSnap.id));
        location.reload();
      }};
      li.appendChild(delBtn);
    }}
    donorList.appendChild(li);
  }});

  const expensesSnap = await getDocs(collection(db, "expenses"));
  expensesSnap.forEach((docSnap) => {{
    const data = docSnap.data();
    totalExpenses += data.amount;
    const li = document.createElement("li");
    li.textContent = `${{data.name}} - ₹${{data.amount}}`;
    if (isAdmin) {{
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {{
        await deleteDoc(doc(db, "expenses", docSnap.id));
        location.reload();
      }};
      li.appendChild(delBtn);
    }}
    expenseList.appendChild(li);
  }});

  document.getElementById("summary").textContent =
    `Total Donations: ₹${{totalDonations}}, Expenses: ₹${{totalExpenses}}, Balance: ₹${{totalDonations - totalExpenses}}`;
}}

let isAdmin = false;
window.login = () => {{
  const entered = document.getElementById("adminPassword").value;
  if (entered === password) {{
    isAdmin = true;
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    loadData();
  }} else {{
    document.getElementById("loginError").textContent = "Incorrect password";
  }}
}}

window.onload = () => {{
  loadData();
}};
