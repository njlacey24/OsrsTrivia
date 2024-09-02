document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let questions = [];
    let filteredQuestions = [];
    let streakCounter = 0;
    let selectedDifficultyMin = null; // Track minimum difficulty
    let selectedDifficultyMax = null; // Track maximum difficulty
    const nextButton = document.getElementById('next-question');
    const changeDifficultyButton = document.getElementById('change-difficulty');
    const questionContainer = document.getElementById('question-container');
    const streakCounterElement = document.getElementById('streak-counter');
    const difficultyModal = document.getElementById('difficulty-modal');
    const closeModalButton = document.getElementById('close-modal');
    const difficultyOptions = document.querySelectorAll('.difficulty-option');

    // Load the Excel file when the page loads
    fetch('data/quiz_questions.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            questions = excelData.slice(1).map(row => {
                return {
                    question: row[0],
                    answers: [row[1], row[2], row[3], row[4]],
                    correctAnswer: row[5],
                    difficulty: parseFloat(row[6]) // Parse difficulty as a float
                };
            });

            loadQuestionsByDifficulty();
        });

    // Function to filter questions by selected difficulty range
    function loadQuestionsByDifficulty() {
        if (selectedDifficultyMin !== null && selectedDifficultyMax !== null) {
            filteredQuestions = questions.filter(q => q.difficulty >= selectedDifficultyMin && q.difficulty <= selectedDifficultyMax);
        } else {
            filteredQuestions = questions;
        }
        currentQuestionIndex = 0;
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex < filteredQuestions.length) {
            const currentQuestion = filteredQuestions[currentQuestionIndex];
            
            // Randomize the answers array
            const randomizedAnswers = shuffleArray(currentQuestion.answers);

            // Prepare HTML for the current question
            const questionHTML = `
                <div class="question fade-in">
                    <p>${currentQuestion.question}</p>
                    <ul class="quiz">
                        ${randomizedAnswers.map((answer, index) => `
                            <li><button class="answer" data-correct="${answer === currentQuestion.correctAnswer}">${answer}</button></li>
                        `).join('')}
                    </ul>
                </div>
            `;

            // Insert the new question HTML
            questionContainer.innerHTML = questionHTML;

            // Allow the fade-in to complete
            setTimeout(() => {
                questionContainer.querySelector('.question').classList.add('show');
            }, 10);

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

        // Update the streak counter
        if (isCorrect) {
            streakCounter++;
        } else {
            streakCounter = 0;
        }

        // Update the counter display
        streakCounterElement.textContent = `Correct Streak: ${streakCounter}`;

        // Show the "Next Question" button
        nextButton.style.display = 'block';
    }

    function showNextQuestion() {
        const currentQuestionElement = questionContainer.querySelector('.question');
        currentQuestionElement.classList.remove('fade-in', 'show');
        currentQuestionElement.classList.add('fade-out');

        // After the fade-out transition, load the next question
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < filteredQuestions.length) {
                loadQuestion();
                nextButton.style.display = 'none';
            } else {
                alert('Quiz completed!');
            }
        }, 500); // Match the duration of the fade-out transition
    }

    function toggleModal() {
        difficultyModal.style.display = 'block';
    }

    function closeModal() {
        difficultyModal.style.display = 'none';
    }

    function selectDifficulty(event) {
        selectedDifficultyMin = parseFloat(event.target.getAttribute('data-difficulty-min'));
        selectedDifficultyMax = parseFloat(event.target.getAttribute('data-difficulty-max'));
        closeModal();
        loadQuestionsByDifficulty();
    }

    nextButton.addEventListener('click', showNextQuestion);
    changeDifficultyButton.addEventListener('click', toggleModal);
    closeModalButton.addEventListener('click', closeModal);
    difficultyOptions.forEach(option => {
        option.addEventListener('click', selectDifficulty);
    });

    // Utility function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target === difficultyModal) {
            closeModal();
        }
    };
});
