function showTab(tabId){
  const allTabs = document.querySelectorAll('.tab');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const activeTab = document.getElementById(tabId);
  activeTab.classList.add('active');
}





function register(){
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const userExists = users.find(user => user.email ===email);
  if(userExists){
    alert("User already registered")
    return;
  }

  users.push({email, password, scores: {} });
  alert("Registration successful! Please log in.");

}