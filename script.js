document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    const questions = document.querySelectorAll('.question');
    const nextButton = document.getElementById('next-question');

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
        // Hide the current question
        questions[currentQuestionIndex].style.display = 'none';

        // Move to the next question
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            // Show the next question
            questions[currentQuestionIndex].style.display = 'block';
            
            // Hide the "Next Question" button until the question is answered
            nextButton.style.display = 'none';
        } else {
            // All questions have been answered; handle quiz end (optional)
            alert('Quiz completed!');
        }
    }

    // Attach event listeners to answer buttons and the next question button
    questions.forEach(question => {
        question.querySelectorAll('.answer').forEach(button => {
            button.addEventListener('click', handleAnswerClick);
        });
    });

    nextButton.addEventListener('click', showNextQuestion);

    // Initial setup: show the first question only
    questions.forEach((question, index) => {
        if (index !== currentQuestionIndex) {
            question.style.display = 'none';
        }
    });
});
