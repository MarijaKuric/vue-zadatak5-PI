<template>
  <div class="user-wrapper">
    <div class="user-container">
      <h2>Korisnički profil</h2>
      
      <div class="user-info">
        <p><strong>Email:</strong> {{ user?.email }}</p>
      </div>
      
      <div class="change-password">
        <h3>Promjena lozinke</h3>
        <form @submit.prevent="handleChangePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Trenutna lozinka:</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="currentPassword" 
              required 
              placeholder="Unesite trenutnu lozinku"
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword">Nova lozinka:</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="newPassword" 
              required 
              placeholder="Unesite novu lozinku (min. 6 znakova)"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmNewPassword">Potvrdi novu lozinku:</label>
            <input 
              type="password" 
              id="confirmNewPassword" 
              v-model="confirmNewPassword" 
              required 
              placeholder="Ponovite novu lozinku"
            />
          </div>
          
          <button type="submit" class="btn-change">Promijeni lozinku</button>
          <div v-if="changePasswordError" class="error-message">{{ changePasswordError }}</div>
          <div v-if="changePasswordSuccess" class="success-message">{{ changePasswordSuccess }}</div>
        </form>
      </div>
      
      <div class="delete-account">
        <h3>Brisanje računa</h3>
        <form @submit.prevent="handleDeleteAccount" class="delete-form">
          <div class="form-group">
            <label for="deletePassword">Lozinka za potvrdu:</label>
            <input 
              type="password" 
              id="deletePassword" 
              v-model="deletePassword" 
              required 
              placeholder="Unesite lozinku za potvrdu"
            />
          </div>
          
          <button type="submit" class="btn-delete">Izbriši račun</button>
          <div v-if="deleteAccountError" class="error-message">{{ deleteAccountError }}</div>
        </form>
      </div>
      
      <button @click="handleLogout" class="btn-logout">Odjava</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  auth,
  signOut,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '../firebase';

export default {
  name: 'UserView',
  setup() {
    const router = useRouter();
    const user = ref(null);
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');
    const deletePassword = ref('');
    const changePasswordError = ref('');
    const changePasswordSuccess = ref('');
    const deleteAccountError = ref('');

    onMounted(() => {
      user.value = auth.currentUser;
      if (!user.value) {
        router.push('/login');
      }
    });

    const handleChangePassword = async () => {
      changePasswordError.value = '';
      changePasswordSuccess.value = '';

      if (newPassword.value !== confirmNewPassword.value) {
        changePasswordError.value = 'Nove lozinke se ne podudaraju!';
        return;
      }

      if (newPassword.value.length < 6) {
        changePasswordError.value = 'Lozinka mora imati najmanje 6 znakova';
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(
          user.value.email, 
          currentPassword.value
        );
        
        await reauthenticateWithCredential(user.value, credential);
        await updatePassword(user.value, newPassword.value);
        
        changePasswordSuccess.value = 'Lozinka je uspješno promijenjena!';
        
        currentPassword.value = '';
        newPassword.value = '';
        confirmNewPassword.value = '';
      } catch (err) {
        changePasswordError.value = 'Greška pri promjeni lozinke: ' + err.message;
        console.error(err);
      }
    };

    const handleDeleteAccount = async () => {
      deleteAccountError.value = '';

      if (!confirm('Jeste li sigurni da želite izbrisati svoj račun? Ova radnja je nepovratna.')) {
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(
          user.value.email, 
          deletePassword.value
        );
        
        await reauthenticateWithCredential(user.value, credential);
        await deleteUser(user.value);
        
        router.push('/login');
      } catch (err) {
        deleteAccountError.value = 'Greška pri brisanju računa: ' + err.message;
        console.error(err);
      }
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (err) {
        console.error(err);
      }
    };

    return {
      user,
      currentPassword,
      newPassword,
      confirmNewPassword,
      deletePassword,
      changePasswordError,
      changePasswordSuccess,
      deleteAccountError,
      handleChangePassword,
      handleDeleteAccount,
      handleLogout
    };
  }
}
</script>

<style scoped>
.user-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%);
  padding: 20px;
}

.user-container {
  width: 100%;
  max-width: 600px;
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

h3 {
  margin: 25px 0 15px;
  color: #00897b;
  font-size: 22px;
  border-bottom: 2px solid #b2dfdb;
  padding-bottom: 8px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.user-info p {
  margin: 12px 0;
  color: #00796b;
  font-size: 16px;
}

.change-password, .delete-account {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.password-form, .delete-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  background-color: white;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #4db6ac;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2);
}

.btn-change {
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

.btn-change:hover {
  background-color: #00897b;
  transform: translateY(-2px);
}

.btn-delete {
  padding: 14px;
  background-color: #ef5350;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s;
}

.btn-delete:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.btn-logout {
  padding: 14px;
  background-color: #78909c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 10px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: #546e7a;
  transform: translateY(-2px);
}

.error-message {
  color: #c62828;
  margin-top: 15px;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ef9a9a;
}

.success-message {
  color: #2e7d32;
  margin-top: 15px;
  padding: 12px;
  background-color: #e8f5e9;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #a5d6a7;
}
</style>