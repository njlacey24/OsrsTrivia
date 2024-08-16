document.querySelectorAll('.answer').forEach(button => {
    button.addEventListener('click', function() {
        const isCorrect = this.getAttribute('data-correct') === 'true';

        // Apply the correct or incorrect class based on the answer
        if (isCorrect) {
            this.classList.add('correct');
        } else {
            this.classList.add('incorrect');
        }

        // Disable all buttons after one has been clicked
        document.querySelectorAll('.answer').forEach(btn => {
            btn.disabled = true;
            if (btn !== this) {
                btn.classList.add(btn.getAttribute('data-correct') === 'true' ? 'correct' : 'incorrect');
            }
        });
    });
});