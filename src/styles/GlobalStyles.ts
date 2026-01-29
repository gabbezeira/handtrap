import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* DEFAULT THEME (Blue/Link) */
    --bg-color: #0f172a; 
    --bg-secondary: #0f172a;
    --surface-color: #1e293b;
    
    --primary-color: #3b82f6;
    --accent-color: #60a5fa; 
    
    --text-primary: #ffffff;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    
    --input-bg: rgba(255, 255, 255, 0.05);
    --border-color: rgba(255, 255, 255, 0.1);
    
    --glass-bg: rgba(15, 23, 42, 0.6);
    --glass-heavy: rgba(15, 23, 42, 0.95);
    --glass-border: 1px solid rgba(59, 130, 246, 0.1);
    
    --accent-glow: transparent;
    --primary-glow: transparent;

    --error-color: #ef4444;
    --success-color: #126630ff;

    /* Fonts */
    --font-heading: 'Orbitron', -apple-system, sans-serif;
    --font-body: 'Inter', -apple-system, sans-serif;
  }

  [data-theme="trap"] {
    /* TRAP THEME (Dominus Impulse Reference) */
    --bg-color: #030303; /* Pure Neutral Black */
    --bg-secondary: #0a0a0a; /* Soft Neutral Black */
    --surface-color: #171717; /* Neutral Surface */
    
    --primary-color: #bc2a8d; /* Trap Card Magenta (Based on Ref) */
    --accent-color: #e855b7; /* Lighter Magenta Highlight */
    
    --text-primary: #ffffff;
    --text-secondary: #e5e5e5;
    --text-muted: #a3a3a3;

    --input-bg: rgba(255, 255, 255, 0.04);
    --border-color: rgba(188, 42, 141, 0.25); /* Magenta Border */

    --glass-bg: rgba(10, 10, 10, 0.7);
    --glass-heavy: rgba(0, 0, 0, 0.95);
    --glass-border: 1px solid rgba(188, 42, 141, 0.2);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--bg-color);
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.4) 100%);
    color: var(--text-primary);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: white;
    letter-spacing: 0.05em;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #020617; 
  }
  ::-webkit-scrollbar-thumb {
    background: #1e293b; 
    border-radius: 4px;
    border: 1px solid #0f172a;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color); 
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: var(--accent-color);
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(62, 147, 252, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(62, 147, 252, 0); }
    100% { box-shadow: 0 0 0 0 rgba(62, 147, 252, 0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
