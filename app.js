  const questions = [
  { q: "Which language runs inside a web browser?", options: { a: "Java", b: "C", c: "Python", d: "JavaScript" }, correct: "d" },
  { q: "What does HTML stand for?", options: { a: "Hyper Trainer Marking Language", b: "Hyper Text Markup Language", c: "Hyper Text Marketing Language", d: "Hyper Transfer Markup Language" }, correct: "b" },
  { q: "What does CSS control?", options: { a: "Structure", b: "Database", c: "Styling", d: "Network" }, correct: "c" },
  { q: "Which company developed JavaScript?", options: { a: "Microsoft", b: "Apple", c: "Netscape", d: "Google" }, correct: "c" },
  { q: "Which symbol is used for comments in JavaScript?", options: { a: "//", b: "<!-- -->", c: "#", d: "/* */" }, correct: "a" },
  { q: "Which CSS property controls text size?", options: { a: "font-style", b: "text-size", c: "font-size", d: "size" }, correct: "c" },
  { q: "JavaScript is a ___ language.", options: { a: "Programming", b: "Markup", c: "Styling", d: "Server" }, correct: "a" }
];

let current = 0;
let score = 0;

// DOM refs
const qCounter = document.getElementById('qCounter');
const questionBox = document.getElementById('questionBox');
const optionsList = document.getElementById('optionsList');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const restartBtn = document.getElementById('restartBtn');
const resultView = document.getElementById('resultView');
const quizCard = document.getElementById('quizCard');
const progressBar = document.getElementById('progressBar');
const scoreText = document.getElementById('scoreText');
const resultMsg = document.getElementById('resultMsg');
const shareBtn = document.getElementById('shareBtn');


function renderQuestion(index){
  const q = questions[index];
  qCounter.textContent = `Question ${index+1} of ${questions.length}`;
  questionBox.textContent = q.q;

  optionsList.innerHTML = '';
  for(const key of Object.keys(q.options)){
    const id = `opt-${index}-${key}`;
    const div = document.createElement('div');
    div.className = 'option';
    div.dataset.value = key;
    div.innerHTML = `<input type="radio" name="option" id="${id}" value="${key}"><label for="${id}">${q.options[key]}</label>`;

    div.addEventListener('click', ()=>{
      const radio = div.querySelector('input[type="radio"]');
      radio.checked = true;
      Array.from(optionsList.children).forEach(c=>c.classList.remove('selected'));
      div.classList.add('selected');
    });

    optionsList.appendChild(div);
  }


// controls visibility
  prevBtn.style.display = index===0? 'none' : 'inline-block';
  nextBtn.textContent = index === questions.length-1 ? 'Submit' : 'Next';

  // restore previously selected if any (bonus: track selections)
  updateProgress();
}

function getSelected(){
  const checked = document.querySelector('input[name="option"]:checked');
  return checked ? checked.value : null;
}

function handleNext(){
  const sel = getSelected();
  if(!sel){
    nextBtn.textContent = 'Choose an option';
    nextBtn.disabled = true;
    setTimeout(()=>{ nextBtn.disabled=false; nextBtn.textContent = current === questions.length-1 ? 'Submit' : 'Next' },700);
    return;
  }


  // score only counted first time on submit for that question
  const correctKey = questions[current].correct;
  // store selection on question object so it persists
  questions[current].selected = sel;

  if(sel === correctKey) questions[current].isCorrect = true;
  else questions[current].isCorrect = false;

  // if last question, show result
  if(current < questions.length - 1){
    current++;
    renderQuestion(current);
  } else {
    // compute score
    score = questions.reduce((acc,cur)=> acc + (cur.isCorrect?1:0), 0);
    showResult();
  }
}


function handlePrev(){
  if(current>0){
    current--;
    renderQuestion(current);
    // restore selection UI
    const sel = questions[current].selected;
    if(sel){
      const radio = document.querySelector(`input[name=\"option\"][value=\"${sel}\"]`);
      if(radio){ radio.checked = true; radio.closest('.option').classList.add('selected'); }
    }
  }
}

function showResult(){
  quizCard.style.display = 'none';
  resultView.style.display = 'block';
  scoreText.textContent = `${score} / ${questions.length}`;
  const percent = Math.round((score/questions.length)*100);
  resultMsg.textContent = percent >= 80 ? 'Excellent work!': percent >=50 ? 'Nice effort!' : 'Keep practicing!';
}


function restartQuiz(){
  // clear selections
  questions.forEach(q=>{ delete q.selected; delete q.isCorrect; });
  current = 0; score = 0;
  resultView.style.display = 'none';
  quizCard.style.display = 'block';
  renderQuestion(current);
}

function updateProgress(){
  const pct = Math.round(((current)/questions.length)*100);
  progressBar.style.width = `${pct}%`;
}

function saveHighScore(){
  const prev = parseInt(localStorage.getItem('highscore') || '0', 10);
  if(score > prev){
    localStorage.setItem('highscore', score);
    alert('New high score saved: ' + score);
  } else {
    alert('Score saved but not a high score. Current high score: ' + prev);
  }
}


// event listeners
nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);
restartBtn.addEventListener('click', restartQuiz);
shareBtn.addEventListener('click', ()=>{
  // Save the final score to localStorage
  saveHighScore();
});

// init
renderQuestion(current);
updateProgress();
