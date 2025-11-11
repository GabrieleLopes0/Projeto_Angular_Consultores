// CONFIGURAÇÃO DO FIREBASE PARA PRODUÇÃO
// Use as mesmas credenciais do environment.ts

export const environment = {
  production: true,
  // IMPORTANTE: Altere para a URL do seu backend em produção
  // Exemplo: 'https://consultores-backend.onrender.com/api'
  apiUrl: 'https://seu-backend.onrender.com/api',
  firebase: {
    apiKey: 'AIzaSyAPUDadOmLqwbChNq4NjQUVU8eqn_Si5uw',
    authDomain: 'consultores-app-5f8f4.firebaseapp.com',
    projectId: 'consultores-app-5f8f4',
    storageBucket: 'consultores-app-5f8f4.firebasestorage.app',
    messagingSenderId: '63344945679',
    appId: '1:63344945679:web:4a858c3cf7ccd0bb98917a'
  }
};

