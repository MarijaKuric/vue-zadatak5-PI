<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>Prijava</h2>
      <form @submit.prevent="handleLogin" class="login-form">
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
        
        <button type="submit" class="btn-login">Prijava</button>
      </form>
      
      <p class="signup-link">
        Nemate račun? <router-link to="/signup">Registrirajte se</router-link>
      </p>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, auth } from '../firebase';

export default {
  name: 'LogInView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const handleLogin = async () => {
      error.value = '';
      try {
        console.log("Pokušavam se prijaviti sa:", email.value);
        
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value, 
          password.value
        );
        
        console.log("Uspješna prijava:", userCredential.user);
        router.push('/user');
      } catch (err) {
        console.error("Detalji greške:", err.code, err.message);
        error.value = 'Pogrešan email ili lozinka';
      }
    };

    return {
      email,
      password,
      error,
      handleLogin
    };
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%);
}

.login-container {
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

.login-form {
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

.btn-login {
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

.btn-login:hover {
  background-color: #00897b;
  transform: translateY(-2px);
}

.signup-link {
  text-align: center;
  margin-top: 25px;
  color: #00796b;
}

.signup-link a {
  color: #26a69a;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
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