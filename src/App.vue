<script setup lang="ts">
import { IonApp, IonButton, IonButtons, IonHeader, IonIcon, IonModal, IonRouterOutlet } from '@ionic/vue';
import { close, settings } from 'ionicons/icons';
import { onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue';
import { db } from './services/database.service';
import { fileToDataURL } from './utis/file';
import AppConfig from './views/components/AppConfig.vue';

const appConfig = reactive({
  logoUrl: '',
  appName: '',
  backgroundUrl: '',
  appLogo: null as Blob | any
})

const configModal = ref()
let logoObjectUrl: string | null = null;

if (!appConfig) {
  throw new Error('Configuração não encontrada.');
}

const form = reactive({
  appName: '',
  logoUrl: ''
});

const getAppName = async () => {
  const appConfigRes = await db.config.toCollection().first();
  appConfig.appName = appConfigRes?.appName;
  form.appName = appConfigRes?.appName || '';
};

const getAppLogo = async () => {
  const logo = await db.logo.toCollection().first();

  // Libera a URL anterior, se existir
  if (logoObjectUrl) {
    URL.revokeObjectURL(logoObjectUrl);
    logoObjectUrl = null;
  }

  if (logo?.file instanceof Blob) {
    logoObjectUrl = URL.createObjectURL(logo.file);
    appConfig.appLogo = logoObjectUrl;
    form.logoUrl = logoObjectUrl;

    try {
      const dataUrl = await fileToDataURL(logo.file);
      if (window.electronAPI?.setIcon) {
        await window.electronAPI.setIcon(dataUrl);
      }
    } catch (err) {
      console.error('Erro ao definir o ícone do aplicativo na inicialização:', err);
    }
  } else {
    // Imagem padrão localizada em public/logo.png
    appConfig.appLogo = '/logo.png';
    form.logoUrl = '/logo.png';
  }
};

const getTheme = async () => {
  const theme = await db.getTheme();
  appConfig.backgroundUrl = theme;
};

const loadAll = async() => {
  await Promise.all([getAppName(), getAppLogo(), getTheme()]);
}

onMounted(() => {
  loadAll();
});

onBeforeUnmount(() => {
  if (logoObjectUrl) {
    URL.revokeObjectURL(logoObjectUrl);
  }
});

provide('config', appConfig);
</script>

<template>
  <ion-app>
    <IonHeader>
      <header>
        <div class="header-logo">
          <img :src="appConfig.appLogo" alt="Logo" width="30" />
          <span>{{ appConfig.appName }}</span>
        </div>
        <div>
          <span class="title visao-geral"> Visão geral </span>
        </div>
        <div class="header-right">
          <IonButton @click="configModal?.$el.present()" size="small" fill="clear" style="color: #fff">
            <IonIcon :icon="settings" style="margin-right: 8px; font-size: 15px"></IonIcon>
            <span>Configurações</span>
          </IonButton>
        </div>
      </header>
    </IonHeader>

      <main class="app-main">
        <ion-router-outlet />
      </main>

    <IonModal ref="configModal" :backdrop-dismiss="false" style="--height: min-height">
      <header>
        <span class="title">Configurações</span>
        <IonButtons slot="end">
          <IonButton @click="configModal?.$el.dismiss()">
            <IonIcon :icon="close" style="margin-right: 8px; font-size: 15px"></IonIcon>
            <span>Fechar</span>
          </IonButton>
        </IonButtons>
      </header>
      <div class="container">
        <AppConfig v-model="form" @onSaved="loadAll" />
      </div>
    </IonModal>
  </ion-app>
</template>

<style scoped>
header {
  flex-shrink: 0;
  padding: 1rem;
  display: flex;
  gap: 5px;
  align-items: center;
  border-bottom: 1px solid #68686844;
  justify-content: space-between;

  & .header-logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    height: 30px;
    padding-right: 10px;
    margin-right: 5px;
  }
}

.app-main {
  flex: 1;
  position: relative;
  width: 100%;
}

@media screen and (max-width: 800px) {
  .visao-geral {
    display: none;
  }
}
</style>
