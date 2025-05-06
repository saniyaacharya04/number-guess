let maxNumber = 100;
let secretNumber;
let attempts = 0;
let timeLeft = 60;
let maxAttempts = Infinity;
let feedbackLevel = 'easy';
let timerInterval;

function generateNumber() {
  return Math.floor(Math.random() * maxNumber) + 1;
}

function setDifficulty() {
  const level = document.getElementById('difficulty').value;
  feedbackLevel = level;
  if (level === "easy") {
    maxNumber = 100;
    timeLeft = 60;
    maxAttempts = Infinity;
  } else if (level === "medium") {
    maxNumber = 50;
    timeLeft = 45;
    maxAttempts = 10;
  } else if (level === "hard") {
    maxNumber = 20;
    timeLeft = 30;
    maxAttempts = 5;
  }
  resetGame();
}

function startGame() {
  const name = document.getElementById('playerName').value.trim();
  if (!name) {
    alert("Please enter your name to start.");
    return;
  }

  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessBtn').disabled = false;
  document.getElementById('resetBtn').disabled = false;
  document.getElementById('startBtn').disabled = true;

  resetGame(); // Also sets up the timer and secret number
}

function checkGuess() {
  const userGuess = Number(document.getElementById('guessInput').value);
  const message = document.getElementById('message');
  const name = document.getElementById('playerName').value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  attempts++;
  document.getElementById('attemptsDisplay').textContent = `Attempts: ${attempts}`;

  if (userGuess === secretNumber) {
    const score = calculateScore();
    message.textContent = `Correct! The number was ${secretNumber}. You got it in ${attempts} attempt(s). Score: ${score}`;
    message.className = 'success';
    endGame(true, score);
    saveToLeaderboard(name, attempts, score);
    return;
  }

  const diff = Math.abs(userGuess - secretNumber);
  let feedback = '';

  // Simplified feedback
  if (feedbackLevel === 'easy') {
    if (diff <= 5) feedback = "Very close!";
    else if (diff <= 15) feedback = "You are getting close";
    else feedback = "Far off.";
  } else if (feedbackLevel === 'medium') {
    if (diff <= 5) feedback = "Close.";
    else if (diff <= 10) feedback = "Not bad.";
    else feedback = "Far.";
  } else if (feedbackLevel === 'hard') {
    feedback = userGuess < secretNumber ? "Low." : "High.";
  }

  message.textContent = feedback;
  message.className = '';

  if (attempts >= maxAttempts) {
    endGame(false);
  }
}

function resetGame() {
  clearInterval(timerInterval);
  secretNumber = generateNumber();
  attempts = 0;
  document.getElementById('message').textContent = '';
  document.getElementById('guessInput').value = '';
  document.getElementById('attemptsDisplay').textContent = 'Attempts: 0';
  document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;

  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessBtn').disabled = false;

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  let currentTime = timeLeft;
  timerInterval = setInterval(() => {
    currentTime--;
    document.getElementById('timer').textContent = `Time left: ${currentTime}s`;

    if (currentTime <= 0) {
      endGame(false);
    }
  }, 1000);
}

function endGame(won, score = 0) {
  clearInterval(timerInterval);
  document.getElementById('guessInput').disabled = true;
  document.getElementById('guessBtn').disabled = true;
  const message = document.getElementById('message');

  if (!won) {
    message.textContent = `Game over. The correct number was ${secretNumber}.`;
    message.className = 'fail';
  }
}

function calculateScore() {
  let score = 0;
  if (feedbackLevel === 'easy') {
    score = Math.floor((timeLeft * 5) + ((maxAttempts - attempts) * 10));
  } else if (feedbackLevel === 'medium') {
    score = Math.floor((timeLeft * 4) + ((maxAttempts - attempts) * 8));
  } else if (feedbackLevel === 'hard') {
    score = Math.floor((timeLeft * 3) + ((maxAttempts - attempts) * 6));
  }
  return score;
}

function saveToLeaderboard(name, attempts, score) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{"easy":[],"medium":[],"hard":[]}');
  leaderboard[feedbackLevel].push({ name, attempts, score });
  leaderboard[feedbackLevel].sort((a, b) => a.score - b.score);
  leaderboard[feedbackLevel] = leaderboard[feedbackLevel].slice(0, 5); // Limit to top 5
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{"easy":[],"medium":[],"hard":[]}');
  const list = document.getElementById('leaderboardList');
  list.innerHTML = '';
  leaderboard[feedbackLevel].forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.attempts} attempt(s) – Score: ${entry.score}`;
    list.appendChild(li);
  });
}

function clearLeaderboard() {
  localStorage.removeItem('leaderboard');
  showLeaderboard();
}

function clearForm() {
  document.getElementById('playerName').value = '';
  document.getElementById('difficulty').value = 'easy';
  document.getElementById('guessInput').value = '';
  document.getElementById('message').textContent = '';
  document.getElementById('attemptsDisplay').textContent = 'Attempts: 0';
  document.getElementById('timer').textContent = 'Time left: 60s';

  document.getElementById('guessInput').disabled = true;
  document.getElementById('guessBtn').disabled = true;
  document.getElementById('resetBtn').disabled = true;
  document.getElementById('startBtn').disabled = false;
}

showLeaderboard();