document.addEventListener('DOMContentLoaded', () => {
  const faqs = document.querySelectorAll('.faq-question');
  faqs.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
  });
});
