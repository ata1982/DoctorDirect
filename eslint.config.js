import js from '@eslint/js';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        IntersectionObserver: 'readonly',

        // Custom globals
        APP_CONFIG: 'readonly',
        GOOGLE_CLIENT_ID: 'readonly',
        AuthManager: 'writable',
        DoctorDirectApp: 'writable',
        UIManager: 'writable',
        StorageManager: 'writable'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-redeclare': 'off',
      'no-useless-escape': 'error'
    },
    files: ['static-website/scripts/*.js']
  }
];