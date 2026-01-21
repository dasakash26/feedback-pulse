(function() {
  'use strict';

  let config = { apiKey: null, baseUrl: '' };
  const queue = window.fp?.q || [];

  const styles = `
    :root {
      --fp-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --fp-bg: oklch(1 0 0);
      --fp-fg: oklch(0.147 0.004 49.25);
      --fp-muted: oklch(0.97 0.001 106.424);
      --fp-muted-fg: oklch(0.553 0.013 58.071);
      --fp-border: oklch(0.923 0.003 48.717);
      --fp-input: oklch(0.923 0.003 48.717);
      --fp-primary: oklch(0.67 0.16 58);
      --fp-primary-fg: oklch(0.99 0.02 95);
      --fp-radius: 0.35rem;
      --fp-ring: oklch(0.709 0.01 56.259);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --fp-bg: oklch(0.216 0.006 56.043); /* Using card bg for modal */
        --fp-fg: oklch(0.985 0.001 106.423);
        --fp-muted: oklch(0.268 0.007 34.298);
        --fp-muted-fg: oklch(0.709 0.01 56.259);
        --fp-border: oklch(1 0 0 / 10%);
        --fp-input: oklch(1 0 0 / 15%);
        --fp-primary: oklch(0.77 0.16 70);
        --fp-primary-fg: oklch(0.28 0.07 46);
        --fp-ring: oklch(0.553 0.013 58.071);
      }
    }
    
    .fp-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      height: 48px;
      padding: 0 20px;
      border-radius: 9999px;
      background: var(--fp-primary);
      color: var(--fp-primary-fg);
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 999998;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
      font-family: var(--fp-font);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .fp-widget-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    .fp-widget-btn svg {
      width: 20px;
      height: 20px;
    }
    
    .fp-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      z-index: 999999;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (min-width: 640px) {
      .fp-modal-overlay {
        align-items: center;
      }
    }
    .fp-modal-overlay.fp-open {
      opacity: 1;
      visibility: visible;
    }
    
    .fp-modal {
      width: 100%;
      max-width: 400px;
      background: var(--fp-bg);
      color: var(--fp-fg);
      border-radius: calc(var(--fp-radius) * 2) calc(var(--fp-radius) * 2) 0 0;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--fp-font);
      position: relative;
      border: 1px solid var(--fp-border);
    }
    @media (min-width: 640px) {
      .fp-modal {
        border-radius: calc(var(--fp-radius) * 1.5);
        transform: scale(0.95) translateY(10px);
        margin: 20px;
      }
    }
    .fp-modal-overlay.fp-open .fp-modal {
      transform: translateY(0);
    }
    @media (min-width: 640px) {
      .fp-modal-overlay.fp-open .fp-modal {
        transform: scale(1) translateY(0);
      }
    }

    .fp-close {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--fp-muted-fg);
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .fp-close:hover {
      background: var(--fp-muted);
      color: var(--fp-fg);
    }

    .fp-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 8px;
    }
    .fp-desc {
      font-size: 14px;
      color: var(--fp-muted-fg);
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .fp-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--fp-fg);
    }
    
    .fp-types {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .fp-type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: var(--fp-bg);
      border: 1px solid var(--fp-border);
      border-radius: var(--fp-radius);
      cursor: pointer;
      transition: all 0.2s;
      color: var(--fp-muted-fg);
    }
    .fp-type-btn svg {
      width: 20px;
      height: 20px;
    }
    .fp-type-btn span {
      font-size: 12px;
      font-weight: 500;
    }
    .fp-type-btn:hover {
      border-color: var(--fp-fg);
      color: var(--fp-fg);
    }
    .fp-type-btn.fp-active {
      border-color: var(--fp-primary);
      background: var(--fp-muted);
      color: var(--fp-primary);
    }

    .fp-stars {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
    }
    .fp-star {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--fp-border);
      transition: transform 0.1s, color 0.2s;
      padding: 4px;
    }
    .fp-star svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }
    .fp-star:hover {
      transform: scale(1.15);
    }
    .fp-star.fp-active {
      color: #fbbf24;
    }

    .fp-input-group {
      margin-bottom: 20px;
    }
    
    .fp-input, .fp-textarea {
      width: 100%;
      padding: 12px 16px;
      background: var(--fp-bg);
      border: 1px solid var(--fp-border);
      border-radius: var(--fp-radius);
      font-family: inherit;
      font-size: 14px;
      color: var(--fp-fg);
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .fp-input:focus, .fp-textarea:focus {
      outline: none;
      border-color: var(--fp-ring);
      box-shadow: 0 0 0 1px var(--fp-ring);
    }
    .fp-textarea {
      min-height: 100px;
      resize: none;
    }

    .fp-submit {
      width: 100%;
      padding: 14px;
      background: var(--fp-primary);
      color: var(--fp-primary-fg);
      border: none;
      border-radius: var(--fp-radius);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: transform 0.1s, opacity 0.2s;
    }
    .fp-submit:hover {
      opacity: 0.95;
    }
    .fp-submit:active {
      transform: scale(0.98);
    }
    .fp-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .fp-error {
      color: #ef4444;
      font-size: 13px;
      text-align: center;
      margin-bottom: 16px;
      background: rgba(239, 68, 68, 0.1);
      padding: 8px;
      border-radius: 8px;
    }

    .fp-success {
      text-align: center;
      padding: 48px 0;
    }
    .fp-success-icon {
      width: 64px;
      height: 64px;
      background: #dcfce7;
      color: #16a34a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .fp-success-icon svg {
      width: 32px;
      height: 32px;
    }
    
    /* Animations */
    @keyframes fp-spin {
      to { transform: rotate(360deg); }
    }
    .fp-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: fp-spin 0.8s linear infinite;
    }
  `;

  function injectStyles() {
    if (document.getElementById('fp-styles')) return;
    const style = document.createElement('style');
    style.id = 'fp-styles';
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function createWidget() {
    injectStyles();

    // Icons
    const ICONS = {
      message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
      bug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="2" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1 2"/></svg>',
      idea: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5a6 6 0 0 0-11 0c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
      other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
      star: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    };

    // Button
    const btn = document.createElement('button');
    btn.className = 'fp-widget-btn';
    btn.innerHTML = `${ICONS.message}<span>Feedback</span>`;
    btn.onclick = openModal;
    document.body.appendChild(btn);

    // Modal
    const overlay = document.createElement('div');
    overlay.className = 'fp-modal-overlay';
    overlay.id = 'fp-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

    overlay.innerHTML = `
      <div class="fp-modal">
        <button class="fp-close" onclick="window.fpCloseModal()">${ICONS.close}</button>
        
        <div id="fp-form-view">
          <h2 class="fp-title">Share your thoughts</h2>
          <p class="fp-desc">Help us improve by sharing your feedback found a bug, or have a feature request?</p>
          
          <div id="fp-error" class="fp-error" style="display: none;"></div>
          
          <form id="fp-form">
            <div class="fp-types">
              <button type="button" class="fp-type-btn fp-active" data-value="OTHER">
                ${ICONS.other}
                <span>General</span>
              </button>
              <button type="button" class="fp-type-btn" data-value="BUG">
                ${ICONS.bug}
                <span>Bug</span>
              </button>
              <button type="button" class="fp-type-btn" data-value="FEATURE">
                ${ICONS.idea}
                <span>Idea</span>
              </button>
            </div>

            <div class="fp-input-group">
              <label class="fp-label">How was your experience?</label>
              <div class="fp-stars">
                ${Array(5).fill(0).map((_, i) => `
                  <button type="button" class="fp-star" data-rating="${i + 1}">${ICONS.star}</button>
                `).join('')}
              </div>
            </div>

            <div class="fp-input-group">
              <label class="fp-label">Details</label>
              <textarea id="fp-content" class="fp-textarea" placeholder="Tell us more..." required></textarea>
            </div>

            <div class="fp-input-group">
              <label class="fp-label">Email (optional)</label>
              <input type="email" id="fp-email" class="fp-input" placeholder="you@example.com">
            </div>

            <button type="submit" id="fp-submit-btn" class="fp-submit">Send Feedback</button>
          </form>
        </div>

        <div id="fp-success-view" class="fp-success" style="display: none;">
          <div class="fp-success-icon">${ICONS.check}</div>
          <h2 class="fp-title" style="margin-bottom: 8px;">Thank You!</h2>
          <p class="fp-desc">We appreciate your feedback.</p>
          <button class="fp-submit" onclick="window.fpCloseModal()" style="margin-top: 20px;">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Logic
    let selectedType = 'OTHER';
    let selectedRating = 0;

    // Type selection
    const typeBtns = overlay.querySelectorAll('.fp-type-btn');
    typeBtns.forEach(btn => {
      btn.onclick = () => {
        typeBtns.forEach(b => b.classList.remove('fp-active'));
        btn.classList.add('fp-active');
        selectedType = btn.dataset.value;
      };
    });

    // Rating selection
    const stars = overlay.querySelectorAll('.fp-star');
    stars.forEach(star => {
      star.onclick = () => {
        selectedRating = parseInt(star.dataset.rating);
        stars.forEach((s, i) => {
          s.classList.toggle('fp-active', i < selectedRating);
        });
      };
    });

    // Submit
    const form = document.getElementById('fp-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const content = document.getElementById('fp-content').value.trim();
      const email = document.getElementById('fp-email').value.trim();
      const errorEl = document.getElementById('fp-error');
      const submitBtn = document.getElementById('fp-submit-btn');

      if (!content) {
        showError('Please enter some details.');
        return;
      }
      if (selectedRating === 0) {
        showError('Please select a rating.');
        return;
      }

      errorEl.style.display = 'none';
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.textContent;
      submitBtn.innerHTML = '<div class="fp-spinner"></div>';

      try {
        const res = await fetch(config.baseUrl + '/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': config.apiKey
          },
          body: JSON.stringify({
            content,
            rating: selectedRating,
            feedbackType: selectedType,
            email: email || null
          })
        });

        if (!res.ok) throw new Error('Failed to submit');

        document.getElementById('fp-form-view').style.display = 'none';
        document.getElementById('fp-success-view').style.display = 'block';

        setTimeout(() => {
            // Optional: Auto close
        }, 3000);

      } catch (err) {
        showError('Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

      function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
    };
  }

  function openModal() {
    document.getElementById('fp-overlay').classList.add('fp-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('fp-overlay').classList.remove('fp-open');
    document.body.style.overflow = '';
    // Reset form after transition
    setTimeout(() => {
      document.getElementById('fp-form').reset();
      document.getElementById('fp-form-view').style.display = 'block';
      document.getElementById('fp-success-view').style.display = 'none';
      document.getElementById('fp-error').style.display = 'none';
      document.getElementById('fp-submit-btn').disabled = false;
      document.getElementById('fp-submit-btn').textContent = 'Send Feedback';
      
      // Reset state
      const overlay = document.getElementById('fp-overlay');
      overlay.querySelectorAll('.fp-type-btn').forEach((b, i) => b.classList.toggle('fp-active', i === 0));
      overlay.querySelectorAll('.fp-star').forEach(s => s.classList.remove('fp-active'));
    }, 300);
  }

  window.fpCloseModal = closeModal;

  window.fp = function(cmd, arg) {
    if (cmd === 'init') {
      config.apiKey = arg;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
      } else {
        createWidget();
      }
    }
  };

  // Auto-init
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const apiKey = script.getAttribute('data-project-key');
    if (apiKey) {
      config.apiKey = apiKey;
      const src = script.src;
      if (src) config.baseUrl = src.replace(/\/widget\.js(\?.*)?$/, '');
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
      } else {
        createWidget();
      }
      break;
    }
  }

  queue.forEach(args => window.fp.apply(null, args));
})();
