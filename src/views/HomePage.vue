<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref } from 'vue';
import Stations from './components/Stations.vue';

const stations = ref(null)
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="false" class="ion-padding">
      <div style="display: flex; justify-content: flex-end;">
        <IonButton @click="stations?.addStation()" size="small" fill="clear" style="color: #fff">
          <div style="display: flex; gap: 10px; align-items: center;">
            <IonIcon :icon="add"></IonIcon>
            <span>Adicionar estação</span>
          </div>
        </IonButton>
      </div>
      <Stations ref="stations" />
    </IonContent>
  </IonPage>
</template>