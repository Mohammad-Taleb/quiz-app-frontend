// switch between login and register tabs
function showTab(tabId){
  const allTabs = document.querySelectorAll('.tab');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const activeTab = document.getElementById(tabId);
  activeTab.classList.add('active');
}

// register a new user
function register(){
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  // get users from local storage or use empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if user already exists
  const userExists = users.find(user => user.email ===email);
  if(userExists){
    alert("User already registered");
    return;
  }

  // add new user
  users.push({email, password, scores: {} });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful! Please log in.");

  showTab("login");
}

// log in existing user
function login(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || {};

  // admin account by default
  if(email === "admin" && password === "admin"){
    localStorage.setItem("currentUser", email);
    window.location.href = "./pages/dashboard.html";
    return;
  }

  // regular user login
  const user = users.find(user => user.email === email && user.password === password);
  if(user){
    localStorage.setItem("currentUser", email);
    window.location.href = "./pages/home.html";
  } else{
    alert("Incorrect email or password!");
  }
}

// home page: load and display quizzes
if(window.location.pathname.includes("home.html")){
  const quizList = document.getElementById("quizList");
  
  // list of quizzes 
  const quizzes = [
    {
      id: 1,
      title: "Programming Basics",
      questions: [
        { q: "What is JavaScript?", options: ["Programming Language", "Car Brand", "Coffee"], answer: "Programming Language" },
        { q: "Which keyword declares a variable?", options: ["var", "int", "string"], answer: "var" },
        { q: "What does HTML stand for?", options: ["HyperText Markup Language", "Hot Mail", "How To Make Language"], answer: "HyperText Markup Language" }
      ]
    },
    {
      id: 2,
      title: "CSS Basics",
      questions: [
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Syntax", "Computer Style Sheets"], answer: "Cascading Style Sheets" },
        { q: "Which property is used to change text color?", options: ["text-color", "font-color", "color"], answer: "color" },
        { q: "How do you select an element with class 'box'?", options: [".box", "#box", "box"], answer: ".box" }
      ]
    }
  ];

  // save quizzes if not already saved
  if(!localStorage.getItem("quizzes")){
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }

  // display quiz buttons
  const savedQuizzes = JSON.parse(localStorage.getItem("quizzes"));
  savedQuizzes.forEach(quiz => {
    const button = document.createElement("button");
    button.textContent = quiz.title;
    button.addEventListener("click", () => {
      localStorage.setItem("currentQuiz", JSON.stringify(quiz));
      window.location.href = "quiz.html";
    });
    quizList.appendChild(button);
  });
}

 // quiz page: display questions
if(window.location.pathname.includes("quiz.html")){
  const quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  const quizTitle = document.getElementById("quizTitle");
  const quizForm = document.getElementById("quizForm");

  quizTitle.textContent = quiz.title;

  // display each question
  quiz.questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `<p>${question.q}</p>`;

    question.options.forEach(option => {
      questionDiv.innerHTML += `
      <label>
        <input type="radio" name="q${index}" value="${option}"/>
        ${option}
        </label><br>
        `;
    });

    quizForm.appendChild(questionDiv);
  });
}

// submit quiz and show score
function submitQuiz(){
  const quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  let score = 0;

  quiz.questions.forEach((question,index) => {
    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
    if(selectedOption && selectedOption.value === question.answer){
      score++;
    }
  });

  // dispaly result
  const result = document.getElementById("result");
  result.textContent = `You scored ${score} out of ${quiz.questions.length}`;

  // save score to current user
  const currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach(user => {
    if(user.email === currentUser){
      user.scores[quiz.title] = score;
    }
  });

    localStorage.setItem("users", JSON.stringify(users));

}
  
// dashboard page: show all users score
if(window.location.pathname.includes("dashboard.html")){
  const userScores = document.getElementById("userScores");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if(users.length === 0){
    userScores.innerHTML = "<p>No users found.</p>";
  } else {
    users.forEach(user => {
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `<h3>${user.email}</h3>`;

      const scores = user.scores || {};
      if(Object.keys(scores).length === 0){
        userDiv.innerHTML += `<p>No quiz scores yet.</p>`;
      } else{
        for (let quizName in scores){
          userDiv.innerHTML += `<p>${quizName}: ${scores[quizName]}</p>`;
        }
      }

      userScores.appendChild(userDiv);
    });
  }
}