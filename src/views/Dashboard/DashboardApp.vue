<script setup lang="ts">
import { db } from '@/services/database.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { logOutOutline, settings } from 'ionicons/icons';
import { computed, inject, provide, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const appConfig = inject('config') as any;
const logoUrl = ref(appConfig.appLogo);

const logoInput = ref<HTMLInputElement | null>(null);
const selectedLogo = ref<File | null>(null);
const logoPreview = ref('');

if (!appConfig) {
  throw new Error('Configuração não encontrada.');
}

const appLogo = appConfig.appLogo;

const backgroundStyle = computed(() => {
  const url = appConfig.backgroundUrl.value;

  return url
    ? {
        backgroundImage: `url("${url}")`,
      }
    : {};
});


const openLogoPicker = () => {
  logoInput.value?.click();
};

const onLogoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem.');
    input.value = '';
    return;
  }

  // Limita o tamanho para 5 MB
  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5 MB.');
    input.value = '';
    return;
  }

  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
  }

  selectedLogo.value = file;
  logoPreview.value = URL.createObjectURL(file);
};

const saveLogo = async () => {
  if (!selectedLogo.value) return;

  const currentLogo = await db.logo.toCollection().first();

  if (currentLogo) {
    await db.logo.update(currentLogo.id, {
      file: selectedLogo.value,
    });
  } else {
    await db.logo.add({
      id: 0,
      file: selectedLogo.value,
    });
  }

  selectedLogo.value = null;

  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
    logoPreview.value = '';
  }

  // Atualiza a logo exibida no restante do aplicativo
  await appConfig.getAppLogo();

  if (logoInput.value) {
    logoInput.value.value = '';
  }
};

const form = reactive({
  appName: appConfig.appName as string,
});

const settingsModal = ref();

const logout = async () => {
  try {
    const user = await db.users.toCollection().first();

    if (user) {
      user.isLoggedIn = false;
      await db.users.update(user.id, user);
      await router.replace({ name: 'Home' });
    }
  } catch (err) {
    console.error(err);
  }
};

const openSettings = () => {
  settingsModal.value.$el.present();
};

const saveSettings = async () => {
  try {
    const config = await db.config.toCollection().first();

    if (config) {
      const result = await db.config.update(config.key, {
        key: 0,
        appName: form.appName,
      });

      console.log({ result });
    } else {
      await db.config.add({
        key: 0,
        appName: form.appName,
      });
    }

    await saveLogo();

    await settingsModal.value.$el.dismiss();
    router.go(0);
  } catch (err) {
    console.error(err);
  }
};

provide('appName', form.appName);
</script>

<template>
  <IonPage id="dashboard">
    <IonHeader :translucent="true">
      <IonToolbar>
        <IonTitle>
          <div class="brand-container" style="display: flex; flex-direction: row; align-items: center; gap: 10px">
            <img :src="logoUrl" alt="" width="40" />
            <span class="brand-text">
              {{ form.appName }}
            </span>
          </div>
        </IonTitle>
        <IonButton class="settings_btn" slot="end" fill="clear" style="--color: #fff" @click="openSettings">
          <IonIcon :icon="settings"></IonIcon>
          <div class="header-btn" style="margin-left: 5px">
            <span>Configurações</span>
          </div>
        </IonButton>
        <IonButton class="logout_btn" slot="end" fill="clear" style="--color: #fff" @click="logout">
          <IonIcon :icon="logOutOutline"></IonIcon>
          <div class="header-btn" style="margin-left: 5px">
            <span>Sair</span>
          </div>
        </IonButton>
      </IonToolbar>
    </IonHeader>
    <ion-content class="ion-padding">
      <main>
        <IonRouterOutlet id="dashboard-outlet"></IonRouterOutlet>
        <div v-if="appConfig.backgroundUrl" id="background" :style="backgroundStyle"></div>
      </main>
      
      <IonModal ref="settingsModal" id="settingsModal" :backdrop-dismiss="false" :show-backdrop="true">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Configurações</IonTitle>

            <IonButtons slot="end">
              <IonButton fill="clear" @click="settingsModal.$el.dismiss()"> Fechar </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent class="ion-padding">
          <form method="post" @submit.prevent="saveSettings">
            <IonInput
              v-model="form.appName"
              label="Nome do aplicativo"
              fill="outline"
              label-placement="floating"
              aria-label="Nome do aplicativo"
            />

            <div class="logo-field">
              <IonText>
                <h3>Logo do aplicativo</h3>
              </IonText>

              <img v-if="logoPreview || appLogo" class="logo-preview" :src="logoPreview || appLogo" alt="Logo do aplicativo" />

              <IonButton type="button" fill="outline" expand="block" @click="openLogoPicker"> Alterar logo </IonButton>

              <input ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden @change="onLogoSelected" />
            </div>

            <IonButton color="primary" expand="block" type="submit"> Salvar </IonButton>
          </form>
        </IonContent>
      </IonModal>
    </ion-content>
  </IonPage>
</template>

<style scoped>
ion-header {
  & ion-toolbar {
    &::part(background) {
      background: rgba(0, 0, 0, 0.589);
    }
  }
}

#background {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
}

ion-modal {
  --backdrop-opacity: 0.7;

  &::part(backdrop) {
    background: rgb(36, 36, 36);
    opacity: 1;
  }
}
#settingsModal {
  & form {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 5px;

    & ion-input {
      --border-color: transparent;
      --background: #313131;
      --color: #ffffff;
    }
  }
}

.settings_btn,
.logout_btn {
  &::part(native) {
    padding-inline: 5px;
  }
}

.logo-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.logo-preview {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 8px;
}

@media screen and (max-width: 800px) {
  .header-btn {
    & span {
      display: none;
    }
  }
}
</style>
