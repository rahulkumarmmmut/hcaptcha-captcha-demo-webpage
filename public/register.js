document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (!name || !email || !password) {
      alert('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // hCaptcha puts the token into a hidden textarea named 'h-captcha-response'
    const tokenEl = document.querySelector('textarea[name="h-captcha-response"]');
    const token = tokenEl ? tokenEl.value : '';

    if (!token) {
      alert('Please complete the CAPTCHA.');
      return;
    }

    try {
      const resp = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, token })
      });
      const result = await resp.json();

      if (result.success) {
        alert('Registration successful!');
      } else {
        alert('Registration failed: ' + (result.message || 'Unknown error.'));
        // If you want, you can reset the widget so user can try again:
        if (window.hcaptcha) hcaptcha.reset();
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('An error occurred. Please try again.');
      if (window.hcaptcha) hcaptcha.reset();
    }
  });
});