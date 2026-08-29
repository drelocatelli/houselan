<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-content">
      <div class="login-wrapper">
        <section class="login-card" aria-labelledby="login-title">
          <div class="brand-logo" aria-hidden="true">
            <img src="/logo.png" alt="Logo" width="70" />
          </div>
          <h1 id="login-title" class="sr-only">Entrar</h1>
          <form @submit.prevent="entrar">

            <div class="input-wrapper">
              <ion-icon
                :icon="lockClosedOutline"
                class="input-icon"
              />

              <ion-input
                v-model="senha"
                name="senha"
                :type="mostrarSenha ? 'text' : 'password'"
                label="Senha"
                label-placement="floating"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="show-password"
                :aria-label="
                  mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                "
                @click="mostrarSenha = !mostrarSenha"
              >
                <ion-icon
                  :icon="mostrarSenha ? eyeOffOutline : eyeOutline"
                />
              </button>
            </div>

            <div class="forgot-password">
              <a href="#" @click.prevent="recuperarSenha">
                Esqueci minha senha
              </a>
            </div>

            <ion-button
              type="submit"
              expand="block"
              class="login-button"
              :disabled="!email || !senha"
            >
              Entrar
              <ion-icon slot="end" :icon="logInOutline" />
            </ion-button>
          </form>

          <footer class="login-footer"> 
            <a href="https://github.com/drelocatelli" style="text-decoration: none;" target="_blank">RaccoonTech</a>
          </footer>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage
} from '@ionic/vue'
import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logInOutline
} from 'ionicons/icons'
import { ref } from 'vue'

const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)

function entrar() {
  console.log({
    email: email.value,
    senha: senha.value
  })
}

function recuperarSenha() {
  console.log('Abrir recuperação de senha')
}
</script>

<style scoped>
:host {
  --login-background: #101010;
  --login-card-background: #222222;
  --login-input-background: #111111;
  --login-text: #f5f5f5;
  --login-muted: #777777;
  --login-link: #91a4ff;
  --login-icon: #8da1ff;
}

.login-content {
  --background: var(--login-background);
}

.login-wrapper {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(100%, 420px);
  padding: 32px 30px 24px;
  border-radius: 17px;
  background: var(--login-card-background);
  box-shadow: 0 22px 70px rgb(0 0 0 / 28%);
}

.brand-logo {
  text-align: center;
  margin: 1rem 0;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
}

.cube-top,
.cube-left,
.cube-right {
  stroke: #080808;
  stroke-width: 3;
  stroke-linejoin: round;
}

.cube-top {
  fill: #24eff2;
}

.cube-left {
  fill: #ff237c;
}

.cube-right {
  fill: #18dfe7;
}

.controller {
  fill: #16e9ee;
  stroke: #080808;
  stroke-width: 3;
  stroke-linejoin: round;
}

.controller-detail {
  fill: none;
  stroke: #080808;
  stroke-width: 3;
  stroke-linecap: round;
}

.controller-button {
  fill: #080808;
}

.input-wrapper {
  position: relative;
  min-height: 58px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 46px;
  border: 1px solid rgb(255 255 255 / 4%);
  border-radius: 11px;
  background: var(--login-input-background);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.input-wrapper:focus-within {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--ion-color-primary) 22%, transparent);
}

.input-icon {
  position: absolute;
  left: 18px;
  z-index: 2;
  color: var(--login-icon);
  font-size: 21px;
}

.input-wrapper ion-input {
  --color: var(--login-text);
  --placeholder-color: #aaa;
  --highlight-color-focused: var(--ion-color-primary);
  --padding-start: 0;
  --padding-end: 54px;
  --padding-top: 7px;
  --padding-bottom: 0;
  font-size: 16px;
}

.show-password {
  position: absolute;
  right: 10px;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  color: #aaa;
  background: transparent;
  cursor: pointer;
  font-size: 21px;
}

.show-password:focus-visible,
.forgot-password a:focus-visible,
.login-button:focus-visible {
  outline: 3px solid var(--ion-color-primary-tint);
  outline-offset: 3px;
}

.forgot-password {
  display: flex;
  justify-content: flex-end;
  margin: 14px 10px 26px;
}

.forgot-password a {
  color: var(--login-link);
  font-size: 14px;
  text-decoration: none;
}

.forgot-password a:hover {
  color: var(--ion-color-primary-tint);
  text-decoration: underline;
}

.login-button {
  --background: var(--ion-color-primary);
  --background-activated: var(--ion-color-primary-shade);
  --background-hover: var(--ion-color-primary-tint);
  --border-radius: 11px;
  --box-shadow: none;
  height: 51px;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  text-transform: none;
}

.login-button ion-icon {
  font-size: 25px;
}

.login-footer {
  margin-top: 30px;
  color: var(--login-muted);
  font-size: 12px;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 16px;
  }

  .login-card {
    padding: 28px 18px 22px;
  }

  .brand-logo {
    margin-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .input-wrapper {
    transition: none;
  }
}
</style>
