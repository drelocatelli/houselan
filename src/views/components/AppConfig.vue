<script setup lang="ts">
const form = defineModel<{appName: string, logoUrl: string}>();

const props = defineProps<{
  onSubmit?: () => void;
}>();
</script>

<template>
  <form class="settings-form" @submit.prevent="props.onSubmit?.()">
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

        <div style="display: flex;">
            <div>
                <img :src="form.logoUrl" alt="" width="40" />
                <input ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden  />
            </div>
            <div>
                select
            </div>
        </div>
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
