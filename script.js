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
    alert("User already registered");
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

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if(email === "admin" && password === "admin"){
    localStorage.setItem("currentUser", email);
    window.location.href = "./pages/dashboard.html";
    return;
  }

  const user = users.find(user => user.email === email && user.password === password);
  if(user){
    localStorage.setItem("currentUser", email);
    window.location.href = "./pages/home.html";
  } else{
    alert("Incorrect email or password!");
  }
}

if(window.location.pathname.includes("./pages/home.html")){
  const quizList = document.getElementById("quizList");
  
  const quizzes = [
    {
      id: 1,
      title: "JavaScript Basics",
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

  if(!localStorage.getItem("quizzes")){
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }

  const savedQuizzes = JSON.parse(localStorage.getItem("quizzes"));
  savedQuizzes.forEach(quiz => {
    const button = document.createElement("button");
    button.textContent = quiz.title;
    button.addEventListener("click", () => {
      localStorage.setItem("currentQuiz", JSON.stringify(quiz));
      window.location.href = "./pages/quiz.html";
    });
    quizList.appendChild(button);
  });
}

if(window.location.pathname.includes("./pages/quiz.html")){
  const quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  const quizTitle = document.getElementById("quizTitle");
  const quizForm = document.getElementById("quizForm");

  quizTitle.textContent = quiz.title;

  quiz.questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `<p>${question.q}</p>`;

    question.options.forEach(option => {
      questionDiv.innerHTML += `
      <label>
        <input type="radio" name="q${index}" value"${option}"/>
        ${option}
        </label><br>
        `;
    });

    quizForm.appendChild(questionDiv);
  });
}

function submitQuiz(){
  const quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  let score = 0;

  quiz.questions.forEach((question,index) => {
    const selectedOption = document.querySelector(`input[name"q${index}"]:checked`);
    if(selectedOption && selectedOption.value === question.answer){
      score++;
    }
  });

  const result = document.getElementById("result");
  result.textContent = `You scored ${score} out of ${quiz.questions.length}`;


  const currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach(user => {
    if(user.email === currentUser){
      user.scores[quiz.title] = score;
    }
  });

    localStorage.setItem("users", JSON.stringify(users));
  }

  if(window.location.pathname.includes("./pages/quiz.html")){
    const users = JSON.parse(localStorage.getItem("users"));
    const userScores = document.getElementById("userScores");
  
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