document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let questions = [];
    const nextButton = document.getElementById('next-question');
    const questionContainer = document.getElementById('question-container');

    // Load the Excel file when the page loads
    fetch('data/quiz_questions.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Convert excel data to questions array
            questions = excelData.slice(1).map(row => {
                return {
                    question: row[0],
                    answers: [row[1], row[2], row[3], row[4]],
                    correctAnswer: row[5]
                };
            });

            // Initialize the quiz with the first question
            loadQuestion();
        });

    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionContainer.innerHTML = `
                <div class="question">
                    <p>${currentQuestion.question}</p>
                    <ul class="quiz">
                        ${currentQuestion.answers.map((answer, index) => `
                            <li><button class="answer" data-correct="${answer === currentQuestion.correctAnswer}">${answer}</button></li>
                        `).join('')}
                    </ul>
                </div>
            `;

            // Attach event listeners to the new buttons
            questionContainer.querySelectorAll('.answer').forEach(button => {
                button.addEventListener('click', handleAnswerClick);
            });
        }
    }

    function handleAnswerClick(event) {
        const selectedButton = event.target;
        const isCorrect = selectedButton.getAttribute('data-correct') === 'true';
        const parentQuiz = selectedButton.closest('.quiz');

        // Disable all buttons for the current question
        parentQuiz.querySelectorAll('.answer').forEach(button => {
            button.disabled = true;
            const correct = button.getAttribute('data-correct') === 'true';
            if (correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });

        // Show the "Next Question" button
        nextButton.style.display = 'block';
    }

    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
            nextButton.style.display = 'none';
        } else {
            alert('Quiz completed!');
        }
    }

    nextButton.addEventListener('click', showNextQuestion);
});
