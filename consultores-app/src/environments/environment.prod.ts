// CONFIGURAÇÃO DO FIREBASE PARA PRODUÇÃO
// Use as mesmas credenciais do environment.ts

export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api', // Altere para sua URL de produção quando fizer deploy
  firebase: {
    apiKey: 'AIzaSyAPUDadOmLqwbChNq4NjQUVU8eqn_Si5uw',
    authDomain: 'consultores-app-5f8f4.firebaseapp.com',
    projectId: 'consultores-app-5f8f4',
    storageBucket: 'consultores-app-5f8f4.firebasestorage.app',
    messagingSenderId: '63344945679',
    appId: '1:63344945679:web:4a858c3cf7ccd0bb98917a'
  }
};

