<script setup lang="ts">
import { IonApp, IonButton, IonButtons, IonHeader, IonIcon, IonModal, IonRouterOutlet } from '@ionic/vue';
import {
  analyticsOutline, cashOutline, close, settings, timeOutline,
  todayOutline,
  trendingUpOutline
} from 'ionicons/icons';
import { onBeforeMount, provide, reactive, ref } from 'vue';
import { useAnalytics } from './composables/useAnalytics.js';
import DataService from './services/data.service.js';
import AppConfig from './views/components/AppConfig.vue';

const configModal = ref()
const analyticsModal = ref()

const dataService = new DataService()

const { analytics, loadAnalytics } = useAnalytics();


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
  
  console.log('load all')
}

onBeforeMount(async () => {
  await loadAll()
  await loadAnalytics()
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
          <IonButton fill="clear" style="color: #fff" @click="analyticsModal?.$el.present()">
            <IonIcon :icon="analyticsOutline" style="font-size: 18px;"></IonIcon>
          </IonButton>
          <IonButton @click="configModal?.$el.present()" size="small" fill="clear" style="color: #fff">
            <IonIcon :icon="settings" style="font-size: 18px"></IonIcon>
          </IonButton>
        </div>
      </header>
    </IonHeader>

      <main class="app-main">
        <ion-router-outlet />
      </main>

    <IonModal ref="configModal" class="max big-width-form"  style="--height: min-height" @willPresent="loadAll" @didDismiss="loadAll">
      <header>
        <span class="title">Configurações</span>
        <IonButtons slot="end">
          <IonButton @click="configModal?.$el.dismiss()">
            <IonIcon :icon="close" style="font-size: 15px"></IonIcon>
          </IonButton>
        </IonButtons>
      </header>
      <div class="container">
        <AppConfig @onSaved="loadAll" />
      </div>
    </IonModal>

    <!-- <IonModal ref="analyticsModal" class="max big-width-form" style="--height: min-height" @willPresent="loadAnalytics">
      <header>
        <span class="title">Analytics</span>
        <IonButtons slot="end">
          <IonButton @click="analyticsModal?.$el.dismiss()">
            <IonIcon :icon="close" style="font-size: 15px"></IonIcon>
          </IonButton>
        </IonButtons>
      </header>
      <div class="container" style="padding: 1rem 1.5rem;">
        <table>
          <thead>
            <th>Horas hoje</th>
            <th>Arrecadado hoje</th>
            <th>Horas contabilizadas</th>
            <th>Total arrecadado</th>
          </thead>
          <tbody>
            <tr v-if="!analytics.isLoading">
              <td>{{ analytics.hoursTodayLabel }}</td>
              <td>{{ analytics.financeTodayLabel }}</td>
              <td>{{ analytics.hoursTotalLabel }}</td>
              <td>{{ analytics.financeTotalLabel }}</td>
            </tr>
            <tr v-else>
              <td><div class="skeleton skeleton-title"></div></td>
              <td><div class="skeleton skeleton-title"></div></td>
              <td><div class="skeleton skeleton-title"></div></td>
              <td><div class="skeleton skeleton-title"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </IonModal> -->
    <IonModal
  ref="analyticsModal"
  class="max big-width-form"
  style="--height: min-height"
  @will-present="loadAnalytics"
>
  <header>
    <span class="title">Analytics</span>
    <IonButtons slot="end">
      <IonButton @click="analyticsModal?.$el.dismiss()">
        <IonIcon :icon="close" style="font-size: 15px"></IonIcon>
      </IonButton>
    </IonButtons>
  </header>

  <div class="container analytics-container">
    <p class="analytics-subtitle">Resumo geral</p>

    <div class="analytics-grid">
      <!-- Arrecadado (destaque principal) -->
      <article class="metric metric--highlight">
        <div class="metric-icon metric-icon--green">
          <IonIcon :icon="cashOutline" />
        </div>
        <div class="metric-body">
          <span class="metric-label">Total arrecadado</span>

          <template v-if="!analytics.isLoading">
            <strong class="metric-value">{{ analytics.financeTotalLabel }}</strong>
            <span class="metric-sub">
              {{ analytics.hoursTotalLabel }} contabilizadas · {{ analytics.minutesTotal }} min
            </span>
          </template>
          <div v-else class="skeleton skeleton-metric"></div>
        </div>
      </article>

      <!-- Arrecadado hoje -->
      <article class="metric">
        <div class="metric-icon metric-icon--blue">
          <IonIcon :icon="trendingUpOutline" />
        </div>
        <div class="metric-body">
          <span class="metric-label">Arrecadado hoje</span>

          <template v-if="!analytics.isLoading">
            <strong class="metric-value">{{ analytics.financeTodayLabel }}</strong>
            <span class="metric-sub">{{ analytics.minutesToday }} min em sessões de hoje</span>
          </template>
          <div v-else class="skeleton skeleton-metric"></div>
        </div>
      </article>

      <!-- Horas contabilizadas -->
      <article class="metric">
        <div class="metric-icon metric-icon--amber">
          <IonIcon :icon="timeOutline" />
        </div>
        <div class="metric-body">
          <span class="metric-label">Horas totais</span>

          <template v-if="!analytics.isLoading">
            <strong class="metric-value">{{ analytics.hoursTotalLabel }}</strong>
            <span class="metric-sub">{{ analytics.minutesTotal }} min · {{ analytics.hoursTotal }} h decimal</span>
          </template>
          <div v-else class="skeleton skeleton-metric"></div>
        </div>
      </article>

      <!-- Horas hoje -->
      <article class="metric">
        <div class="metric-icon metric-icon--purple">
          <IonIcon :icon="todayOutline" />
        </div>
        <div class="metric-body">
          <span class="metric-label">Horas hoje</span>

          <template v-if="!analytics.isLoading">
            <strong class="metric-value">{{ analytics.hoursTodayLabel }}</strong>
            <span class="metric-sub">{{ analytics.minutesToday }} min · {{ analytics.hoursToday }} h decimal</span>
          </template>
          <div v-else class="skeleton skeleton-metric"></div>
        </div>
      </article>
    </div>

    <div v-if="!analytics.isLoading && analytics.minutesTotal === 0" class="analytics-empty">
      <IonIcon :icon="analyticsOutline" />
      <span>Nenhuma sessão registrada ainda</span>
      <span class="analytics-empty-sub">Os números aparecem conforme as estações são usadas.</span>
    </div>
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

table {
  width: 100%;
  border-collapse: collapse;

  thead {
    border-bottom: 1px solid #272727;
  }

  td,
  th {
    padding: 1rem 8px;
    text-align: start;
  }
}

.analytics-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.analytics-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.8125rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 520px) {
  .analytics-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.metric {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 16px;
  background: #161616;
  border: 1px solid #e5e7eb1e;
  border-radius: 12px;
}

.metric--highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #161616 0%, #1b2a20 100%);
  border-color: #10b98133;
}

.metric-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.metric-icon--green  { background: #10b98165; color: #10b981; }
.metric-icon--blue   { background: #2960a865; color: #3b82f6; }
.metric-icon--amber  { background: #f59e0b65; color: #f59e0b; }
.metric-icon--purple { background: #8b5cf665; color: #a78bfa; }

.metric-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.metric-label {
  color: #9ca3af;
  font-size: 12px;
}

.metric-value {
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  word-break: break-word;
}

.metric--highlight .metric-value {
  font-size: 1.875rem;
  color: #4dd171;
}

.metric-sub {
  color: #6b7280;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.analytics-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 2rem 1rem;
  border: 1px dashed #272727;
  border-radius: 12px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.analytics-empty ion-icon {
  font-size: 28px;
  opacity: 0.6;
}

.analytics-empty-sub {
  color: #6b7280;
  font-size: 11px;
}

.skeleton-metric {
  height: 2.25rem;
  width: 70%;
  border-radius: 6px;
  margin: 4px 0 6px;
}

/* se ainda não tiver no App.vue, reaproveite as dos cards de estação */
.skeleton {
  background: linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 37%, #1f1f1f 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}


@media screen and (max-width: 800px) {
  .visao-geral {
    display: none;
  }
}
</style>
