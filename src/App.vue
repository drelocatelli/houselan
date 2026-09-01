<script setup lang="ts">
import { IonApp, IonButton, IonButtons, IonHeader, IonIcon, IonModal, IonRouterOutlet } from '@ionic/vue';
import { close, settings } from 'ionicons/icons';
import { onMounted, provide, reactive, ref } from 'vue';
import DataService from './services/data.service.js';
import AppConfig from './views/components/AppConfig.vue';

const configModal = ref()

const dataService = new DataService()

const appConfig = reactive({
  logoUrl: '',
  appName: '',
  backgroundUrl: '',
  pricePerHour: 0
})

if (!appConfig) {
  throw new Error('Configuração não encontrada.');
}

const loadAll = async() => {
  const data = await dataService.loadAll()
  appConfig.logoUrl = data.logoUrl
  appConfig.appName = data.config.appName
  appConfig.backgroundUrl = data.backgroundUrl
  appConfig.pricePerHour = data.config.pricePerHour
}

onMounted(async () => {
  await loadAll()
});

provide('config', appConfig);
</script>

<template>
  <ion-app>
    <IonHeader>
      <header>
        <div class="header-logo">
          <img :src="appConfig.logoUrl" alt="Logo" width="30" />
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
        <AppConfig @onSaved="loadAll" />
      </div>
    </IonModal>
  </ion-app>
</template>

<style scoped>
header {
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
