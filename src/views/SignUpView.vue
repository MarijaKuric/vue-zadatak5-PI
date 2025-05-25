<template>
  <div class="signup-wrapper">
    <div class="signup-container">
      <h2>Registracija</h2>
      <form @submit.prevent="handleSignUp" class="signup-form">
        <div class="form-group">
          <label for="username">Korisničko ime:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            placeholder="Unesite korisničko ime"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Unesite email adresu"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Lozinka:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Unesite lozinku"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Ponovi lozinku:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="Ponovite lozinku"
          />
        </div>
        
        <button type="submit" class="btn-register">Registracija</button>
      </form>
      
      <p class="login-link">
        Već imate račun? <router-link to="/login">Prijavite se</router-link>
      </p>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'SignUpView',
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');

    const handleSignUp = () => {
      error.value = '';

      if (password.value !== confirmPassword.value) {
        error.value = 'Lozinke se ne podudaraju!';
        return;
      }

      try {
        userStore.register({
          username: username.value,
          email: email.value,
          password: password.value
        });
        
        router.push('/user');
      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      error,
      handleSignUp
    };
  }
}
</script>

<style scoped>
.signup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%);
}

.signup-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #00796b;
  font-size: 28px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #00897b;
}

input {
  padding: 14px;
  border: 2px solid #b2dfdb;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #4db6ac;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2);
}

.btn-register {
  padding: 14px;
  background-color: #26a69a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s;
}

.btn-register:hover {
  background-color: #00897b;
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  margin-top: 25px;
  color: #00796b;
}

.login-link a {
  color: #26a69a;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #c62828;
  margin-top: 20px;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ef9a9a;
}
</style>