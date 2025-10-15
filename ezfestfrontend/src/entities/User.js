// src/entities/User.js

export const User = {
  async me() {
    // Simulação de login do usuário
    const userData = JSON.parse(localStorage.getItem('user')) || null;
    return userData;
  },

  async login() {
    // Simula login abrindo um modal ou redirecionando
    alert('Login simulado: este botão deve abrir o fluxo de login real.');
    const dummyUser = {
      full_name: 'Usuário Demo',
      email: 'demo@ezfest.com',
      cpf: '',
      birth_date: '',
      user_type: 'customer',
    };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    return dummyUser;
  },

  async updateMyUserData(data) {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { ...userData, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
};
