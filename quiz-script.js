let score = 0;
let timeLeft = 300; // 5 minutes (300 seconds) for 10 questions
let timer;
let currentQuestion = 1;
let userAnswers = {};

const correctAnswers = {
    1: 'c', 2: 'b', 3: 'c', 4: 'a', 5: 'b',
    6: 'a', 7: 'b', 8: 'c', 9: 'a', 10: 'c'
};

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function selectAnswer(questionNum, selected) {
    userAnswers[questionNum] = selected;
    updateScore(questionNum, selected);
}

function updateScore(questionNum, selected) {
    const correct = correctAnswers[questionNum];
    if (selected === correct) {
        score += 1;
    } else if (selected) {
        score -= 0.33;
    }
    score = Math.max(0, score);
    document.getElementById('currentScore').textContent = score.toFixed(2);
}

function goToNext(current) {
    if (current < 10) {
        document.getElementById(`q${current}`).style.display = 'none';
        document.getElementById(`q${current + 1}`).style.display = 'block';
        document.getElementById(`prev-btn-${current + 1}`).style.display = 'inline-block';
        currentQuestion = current + 1;
    } else {
        submitQuiz();
    }
}

function goToPrevious(current) {
    if (current > 1) {
        document.getElementById(`q${current}`).style.display = 'none';
        document.getElementById(`q${current - 1}`).style.display = 'block';
        document.getElementById(`prev-btn-${current - 1}`).style.display = 'none';
        currentQuestion = current - 1;
    }
}

function submitQuiz() {
    clearInterval(timer);
    calculateResults();
    document.getElementById('question-slide').style.display = 'none';
    document.getElementById('result-slide').style.display = 'block';
    document.getElementById('answer-sheet-btn').style.display = 'block';
    document.getElementById('bar-graph').style.display = 'block';
    document.getElementById('pie-chart').style.display = 'block';
}

function calculateResults() {
    let right = 0, wrong = 0, unattempted = 0;
    for (let i = 1; i <= 10; i++) {
        const userAnswer = userAnswers[i];
        if (userAnswer === correctAnswers[i]) {
            right++;
        } else if (userAnswer) {
            wrong++;
        } else {
            unattempted++;
        }
    }
    score = right * 1 - wrong * 0.33;
    score = Math.max(0, score);
    document.getElementById('currentScore').textContent = score.toFixed(2);
    document.getElementById('finalScore').textContent = score.toFixed(2);
    document.getElementById('right-count').textContent = right;
    document.getElementById('wrong-count').textContent = wrong;
    document.getElementById('ct-right').textContent = right;
    document.getElementById('total-right').textContent = right;
    document.getElementById('ct-wrong').textContent = wrong;
    document.getElementById('total-wrong').textContent = wrong;
    document.getElementById('ct-unattempted').textContent = unattempted;
    document.getElementById('total-unattempted').textContent = unattempted;
    document.getElementById('ct-score').textContent = score.toFixed(2);
    document.getElementById('total-score').textContent = score.toFixed(2);
    document.getElementById('ct-time').textContent = (300 - timeLeft);
    document.getElementById('total-time-result').textContent = (300 - timeLeft);
    document.getElementById('total-time').textContent = (300 - timeLeft);
    const accuracy = right / 10 * 100;
    document.getElementById('ct-accuracy').textContent = `${accuracy.toFixed(0)}%`;
    document.getElementById('total-accuracy').textContent = `${accuracy.toFixed(0)}%`;
    document.getElementById('accuracy').textContent = `${accuracy.toFixed(0)}%`;

    // Update X-Y bar graph
    const total = 10;
    const correctWidth = (right / total) * 100;
    const wrongWidth = (wrong / total) * 100;
    const unattemptedWidth = (unattempted / total) * 100;
    document.getElementById('bar-correct').style.width = `${correctWidth}%`;
    document.getElementById('bar-incorrect').style.width = `${wrongWidth}%`;
    document.getElementById('bar-unattempted').style.width = `${unattemptedWidth}%`;

    // Update circular pie chart (circumference = 2 * π * 80 ≈ 502 pixels)
    const pieCorrect = (right / total) * 502;
    const pieIncorrect = (wrong / total) * 502;
    const pieUnattempted = (unattempted / total) * 502;
    document.getElementById('pie-correct').style.strokeDashoffset = `${502 - pieCorrect}`;
    document.getElementById('pie-incorrect').style.strokeDashoffset = `${502 - pieIncorrect - pieCorrect}`;
    document.getElementById('pie-unattempted').style.strokeDashoffset = `${502 - pieUnattempted - pieIncorrect - pieCorrect}`;
}

function showAnswerSheet() {
    document.getElementById('result-slide').style.display = 'none';
    document.getElementById('answer-sheet-slide').style.display = 'block';
    for (let i = 1; i <= 10; i++) {
        const userAttempt = userAnswers[i] || 'Not Attempted';
        const attemptElement = document.getElementById(`attempt-q${i}`);
        if (userAttempt === 'Not Attempted') {
            attemptElement.style.color = '#808080';
            attemptElement.textContent = `Your Answer: Not Attempted`;
        } else if (userAttempt === correctAnswers[i]) {
            attemptElement.style.color = '#00ff00';
            attemptElement.textContent = `Your Answer: ${userAttempt} (Correct)`;
        } else {
            attemptElement.style.color = '#ff0000';
            attemptElement.textContent = `Your Answer: ${userAttempt}`;
        }
    }
}

function goBackToResult() {
    document.getElementById('answer-sheet-slide').style.display = 'none';
    document.getElementById('result-slide').style.display = 'block';
}

// Start the timer when the page loads
window.onload = startTimer;
