<script setup lang="ts">
import { db } from '@/services/database.service';
import { fileToDataURL } from '@/utis/file';
import { modalController } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = defineModel<{appName: string, logoUrl: string}>();
const logoInput = ref<HTMLInputElement | null>(null)
const selectedLogo = ref<File | null>(null);
const logoPreview = ref('');

const router = useRouter()

const emit = defineEmits(['onSaved'])

const openLogoPicker = () => {
  logoInput.value.click();
}

const onLogoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem.');
    input.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5 MB.');
    input.value = '';
    return;
  }

  if (form.value.logoUrl) {
    URL.revokeObjectURL(form.value.logoUrl);
  }

  selectedLogo.value = file;
  form.value.logoUrl = URL.createObjectURL(file);
}

const saveSettings = async () => {
  try {
    const config = await db.config.toCollection().first();

    if (config) {
      const result = await db.config.update(config.key, {
        key: 0,
        appName: form.value.appName,
      });

      console.log({ result });
    } else {
      await db.config.add({
        key: 0,
        appName: form.value.appName,
      });
    }

    await saveLogo();

    emit('onSaved')

    await modalController.dismiss();
    router.go(0);
  } catch (err) {
    console.error(err);
  }
};

const saveLogo = async () => {
  if (!selectedLogo.value) return;

  const logoFile = selectedLogo.value;

  const currentLogo = await db.logo.toCollection().first();

  if (currentLogo) {
    await db.logo.update(currentLogo.id, {
      file: logoFile,
    });
  } else {
    await db.logo.add({
      id: 0,
      file: logoFile,
    });
  }

  try {
    const dataUrl = await fileToDataURL(logoFile);
    if (window.electronAPI?.setIcon) {
      await window.electronAPI.setIcon(dataUrl);
    }
  } catch (err) {
    console.error('Erro ao atualizar o ícone do aplicativo:', err);
  }

  selectedLogo.value = null;

  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
    logoPreview.value = '';
  }

  if (logoInput.value) {
    logoInput.value.value = '';
  }
};
</script> 

<template>
  <form class="settings-form" @submit.prevent="saveSettings">
    <div class="field">
      <label for="app-name">Nome do aplicativo</label>

      <input
        id="app-name"
        v-model="form.appName"
        type="text"
        placeholder="Digite o nome do aplicativo"
        autocomplete="off"
      />

      <div class="logo-field">
        <label for="app-logo">Logo</label>

        <div style="display: flex; align-items: center; gap: 1rem;">
            <div>
                <img :src="form.logoUrl" alt="" width="40" />
                <input ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden  />
            </div>
            <div>
                <button class="outline" type="button" @click="openLogoPicker">Alterar</button>
                <input ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden @change="onLogoSelected">
            </div>
          </div>
          <label for="app-logo" style="color: #555;">Tamanho Recomendado: 511 x 570</label>
        </div>

    </div>

    <button type="submit">
      Salvar
    </button>
  </form>
</template>

<style scoped>
.settings-form {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  box-sizing: border-box;
  color: #f2f2f2;
}


</style>
