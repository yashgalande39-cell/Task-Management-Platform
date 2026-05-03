// Lightweight toast notifications — no package needed
// Uses a custom DOM element injected once

let container = null;

const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.id = 'tf-toast-container';
    container.style.cssText =
      'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  return container;
};

const show = (message, type = 'info', duration = 3000) => {
  const c = getContainer();
  const el = document.createElement('div');

  const colors = {
    success: { bg: '#052e16', border: '#16a34a', icon: '✓', text: '#4ade80' },
    error: { bg: '#2d0b0b', border: '#dc2626', icon: '✕', text: '#f87171' },
    info: { bg: '#0d1929', border: '#3b82f6', icon: 'ℹ', text: '#60a5fa' },
    warning: { bg: '#1a1200', border: '#d97706', icon: '⚠', text: '#fbbf24' },
  };
  const s = colors[type] || colors.info;

  el.style.cssText = `
    display:flex;align-items:center;gap:10px;padding:12px 16px;
    border-radius:12px;font-size:14px;font-family:'Inter',sans-serif;
    background:${s.bg};border:1px solid ${s.border};color:${s.text};
    box-shadow:0 8px 32px rgba(0,0,0,0.4);pointer-events:all;
    animation:slideIn 0.2s ease;min-width:240px;max-width:380px;
  `;
  el.innerHTML = `<span style="font-size:16px;flex-shrink:0">${s.icon}</span><span>${message}</span>`;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fadeOut{from{opacity:1}to{opacity:0}}
  `;
  if (!document.getElementById('tf-toast-style')) {
    style.id = 'tf-toast-style';
    document.head.appendChild(style);
  }

  c.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, duration);
};

export const toast = {
  success: (msg, d) => show(msg, 'success', d),
  error: (msg, d) => show(msg, 'error', d),
  info: (msg, d) => show(msg, 'info', d),
  warning: (msg, d) => show(msg, 'warning', d),
};
