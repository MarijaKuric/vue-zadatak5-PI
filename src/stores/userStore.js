import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null
  }),
  actions: {
    register(userData) {
      const userExists = this.users.some(
        user => user.email === userData.email || user.username === userData.username
      );

      if (userExists) {
        throw new Error('Korisnik s ovim emailom ili korisničkim imenom već postoji');
      }

      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password
      };

      this.users.push(newUser);
      this.currentUser = newUser;
      return newUser;
    },

    login(credentials) {
      const user = this.users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Pogrešan email ili lozinka');
      }

      this.currentUser = user;
      return user;
    },

    logout() {
      this.currentUser = null;
    },

    changePassword({ currentPassword, newPassword }) {
      if (!this.currentUser) {
        throw new Error('Niste prijavljeni');
      }

      if (this.currentUser.password !== currentPassword) {
        throw new Error('Trenutna lozinka nije točna');
      }

      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.users[userIndex].password = newPassword;
        this.currentUser.password = newPassword;
      }
    },

    deleteAccount(password) {
      if (!this.currentUser) {
        throw new Error('Niste prijavljeni');
      }

      if (this.currentUser.password !== password) {
        throw new Error('Lozinka nije točna');
      }

      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);
      }

      this.currentUser = null;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-storage',
        storage: localStorage
      }
    ]
  }
});