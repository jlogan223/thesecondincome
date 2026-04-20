// Extra Income UK — main.js

// Animate cards on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.article-card, .featured-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Newsletter form
document.querySelector('.newsletter-form button')?.addEventListener('click', () => {
  const input = document.querySelector('.newsletter-form input');
  if (input.value.includes('@')) {
    input.value = '';
    input.placeholder = '✓ You\'re subscribed!';
    input.style.borderColor = '#c8972a';
  }
});
