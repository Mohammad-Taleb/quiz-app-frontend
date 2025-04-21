function showTab(tabId){
  const allTabs = document.querySelectorAll('.tab');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const activeTab = document.getElementById(tabId);
  activeTab.classList.add('active');
}


function register(){
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.email ===email);
  if(userExists){
    alert("User already registered")
    return;
  }

  users.push({email, password, scores: {} });
  localStorage.setItem("users", JSON.stringify(users))
  alert("Registration successful! Please log in.");

  showTab("login");
}


function login(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users"))

  if(email === "admin" && password === "admin"){
    localStorage.setItem("currentUser", email);
    window.location.href = "dashboard.html";
    return;
  }

  const user = users.find(user => user.email === email && user.password === password);
  if(user){
    localStorage.setItem("currentUser", email);
    window.location.href = "home.html";
  } else{
    alert("Incorrect email or password!");
  }
}