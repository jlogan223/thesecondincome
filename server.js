// Cookie consent — slim bottom bar
(function() {
  if (localStorage.getItem('tsi_cookie_consent')) return;

  const bar = document.createElement('div');
  bar.id = 'cookie-bar';
  bar.innerHTML = `
    <div class="cookie-inner">
      <p>We use cookies to improve your experience and analyse site traffic. 
         <a href="/privacy-policy.html">Privacy & Cookie Policy</a></p>
      <div class="cookie-actions">
        <button id="cookie-accept">Accept</button>
        <button id="cookie-decline">Decline</button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);

  // Animate in after short delay
  setTimeout(() => bar.classList.add('cookie-visible'), 500);

  document.getElementById('cookie-accept').addEventListener('click', function() {
    localStorage.setItem('tsi_cookie_consent', 'accepted');
    dismissBar();
    // Load analytics here once we have the GA code
  });

  document.getElementById('cookie-decline').addEventListener('click', function() {
    localStorage.setItem('tsi_cookie_consent', 'declined');
    dismissBar();
  });

  function dismissBar() {
    bar.classList.remove('cookie-visible');
    setTimeout(() => bar.remove(), 400);
  }
})();
