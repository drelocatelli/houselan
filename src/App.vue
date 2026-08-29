<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { db } from './services/database.service';

const appName = ref('');
const appLogo = ref<Blob | any>(null)
let logoObjectUrl: string | null = null;

onMounted(async () => {
  await Promise.all([
    getAppName(),
    getAppLogo(),
  ]);
});

onBeforeUnmount(() => {
  if (logoObjectUrl) {
    URL.revokeObjectURL(logoObjectUrl);
  }
});


const getAppName = async () => {
  const appConfig = await db.config.toCollection().first();
  appName.value = appConfig?.appName;
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
    appLogo.value = logoObjectUrl;
  } else {
    // Imagem padrão localizada em public/logo.png
    appLogo.value = "/logo.png";
  }
};


provide('config', {
  appName,
  getAppName,
  appLogo,
  getAppLogo
})
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
