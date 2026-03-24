/**
 * Lightweight quiz behavior: native radios, check button, feedback region, reset.
 * Expects markup documented on quiz pages under [data-quiz-root].
 */
(() => {
  function showFeedback(section, isCorrect) {
    const fb = section.querySelector('.quiz-feedback');
    const body = section.querySelector('.quiz-feedback__body');
    const fieldset = section.querySelector('fieldset');
    if (!fb || !body || !fieldset) return;

    const correctText = section.getAttribute('data-explain-correct') || '';
    const incorrectText = section.getAttribute('data-explain-incorrect') || '';

    fb.hidden = false;
    fb.classList.toggle('quiz-feedback--correct', isCorrect);
    fb.classList.toggle('quiz-feedback--incorrect', !isCorrect);
    const prefix = isCorrect ? 'Correct. ' : 'Not quite. ';
    body.textContent = prefix + (isCorrect ? correctText : incorrectText);

    const id = fb.id || `quiz-feedback-${Math.random().toString(36).slice(2)}`;
    fb.id = id;
    fieldset.setAttribute('aria-describedby', id);

    section.classList.add('quiz-question--answered');
    section.classList.toggle('quiz-question--correct', isCorrect);
    section.classList.toggle('quiz-question--incorrect', !isCorrect);

    fb.focus({ preventScroll: false });
  }

  function checkQuestion(section) {
    const correct = section.getAttribute('data-quiz-correct');
    const fieldset = section.querySelector('fieldset');
    const fb = section.querySelector('.quiz-feedback');
    const body = section.querySelector('.quiz-feedback__body');
    if (!fieldset || correct == null || !fb || !body) return;

    const selected = fieldset.querySelector('input[type="radio"]:checked');
    if (!selected) {
      fb.hidden = false;
      fb.classList.remove('quiz-feedback--correct', 'quiz-feedback--incorrect');
      body.textContent =
        'Reminder: Select an answer, then activate Check answer.';
      const id = fb.id || `quiz-feedback-${Math.random().toString(36).slice(2)}`;
      fb.id = id;
      fieldset.setAttribute('aria-describedby', id);
      fb.focus({ preventScroll: false });
      return;
    }

    showFeedback(section, selected.value === correct);
  }

  function clearQuestion(section) {
    const fieldset = section.querySelector('fieldset');
    const fb = section.querySelector('.quiz-feedback');
    const body = section.querySelector('.quiz-feedback__body');
    if (fieldset) {
      fieldset.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.checked = false;
      });
      fieldset.removeAttribute('aria-describedby');
    }
    if (fb && body) {
      fb.hidden = true;
      fb.classList.remove('quiz-feedback--correct', 'quiz-feedback--incorrect');
      body.textContent = '';
    }
    section.classList.remove(
      'quiz-question--answered',
      'quiz-question--correct',
      'quiz-question--incorrect'
    );
  }

  function bindQuestion(section) {
    const btn = section.querySelector('.quiz-check-btn');
    if (!btn) return;
    btn.addEventListener('click', () => checkQuestion(section));
  }

  function bindRoot(root) {
    root.querySelectorAll('.quiz-question').forEach(bindQuestion);
    const reset = root.querySelector('.quiz-reset-btn');
    if (reset) {
      reset.addEventListener('click', () => {
        root.querySelectorAll('.quiz-question').forEach(clearQuestion);
      });
    }
  }

  document.querySelectorAll('[data-quiz-root]').forEach(bindRoot);
})();
