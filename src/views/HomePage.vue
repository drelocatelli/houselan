<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import Stations from './components/Stations.vue';

</script>

<template>
  <IonPage>
    <IonContent :fullscreen="false" class="ion-padding">
      <Stations />
    </IonContent>
  </IonPage>
</template>