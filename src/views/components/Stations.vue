<script setup lang="ts">
import DataService from '@/services/data.service.js';
import { ClientStation, Station, StationStatus } from '@/services/database.service';
import { alertController, IonButton, IonIcon, IonLabel, IonModal, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSpinner, toastController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { computed, inject, onMounted, reactive, readonly, ref } from 'vue';
import StationList from './StationList.vue';
import TimeInput from './TimeInput.vue';

const appConfig = inject('config');

const dataService = new DataService();

const addClientModal = ref();
const addStationModal = ref();

const stations = reactive({
  isLoading: true,
  items: [] as Station[],
});


const finishedStations = computed(() => (stations.items.filter((station) => station.client?.finished)));

const inUseStations = computed(() => (stations.items.filter((s) => !s.client?.finished && s.client?.time > 0)));

const initialForm = readonly({
  title: '',
  status: 'free',
  user: '',
  time: 0,
  stationId: null
});
const form = reactive({...initialForm});

const price = computed(() => {
  const totalSeconds = Number(form.time) || 0;

  if (totalSeconds <= 0) {
    return 0;
  }

  const pricePerHour = Number((appConfig as any)?.pricePerHour) || 0;

  const totalHours = totalSeconds / 3600;

  return totalHours * pricePerHour;
});

const addStation = async () => {
  const modal = addStationModal.value?.$el;
  await modal.present();
};

const resetForm = () => {
  Object.assign(form, initialForm);
};

const newStation = async(e: Event) => {
  const form = e.target as HTMLFormElement;
  const payload = new FormData(form as any)
  const title = payload.get('title') as string;
  const status = payload.get('status') as StationStatus;

  if(title === '' || title === undefined || title === null) return;
  
  // save station
  try {
    stations.isLoading = true;

    const stationCreated: Station = {
      title,
      status
    };

    const allStations = await dataService.createStation(stationCreated);
    stations.items = allStations;
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addStationModal.value?.$el.dismiss();

    resetForm()
    await toastController.create({
      message: 'Estação salva com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    }).then((toast) => {
      toast.present()
    })
    
  } catch(err) {
    alert('ocorreu um erro ao salvar a estação');
    console.error(err)
  } finally {
    stations.isLoading = false;
  }
}

const newClient = async () => {
  try {
    stations.isLoading = true;
    
    const clientStationCreated: ClientStation = {
      title: form.title,
      stationId: form.stationId,
      user: form?.user || 'Cliente',
      time: form.time,
      datetime: new Date().toISOString(),
      finished: false
    };

    if(Number(form.time) <= 0) {
      await toastController.create({
        message: 'Por favor, insira um tempo de uso válido',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      }).then((toast) => {
        toast.present()
      })
      return
    }
    
    const allStations = await dataService.assignClientToStation(clientStationCreated);

    stations.items = allStations;
    resetForm()
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.error(err);
  } finally {
    addStationModal.value?.$el.dismiss();
    stations.isLoading = false;
  }
};

const loadStations = async () => {
  try {
    stations.isLoading = true;

    stations.items = await dataService.getStations();

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.error(err);
  } finally {
    stations.isLoading = false;
  }
};

const openExcludeStation = async (id: number) => {
  if (id === undefined || id === null) return;

  await alertController
    .create({
      header: 'Excluir estação',
      message: 'Tem certeza de que deseja excluir esta estação?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'clear-button',
        },
        {
          text: 'Excluir',
          cssClass: 'clear-button',
          handler: async () => {
            stations.isLoading = true;
            const newStations = await dataService.removeStation(id);
            await new Promise(resolve => setTimeout(resolve, 1000))
            stations.items = newStations;
            stations.isLoading = false
          },
        },
      ],
    })
    .then((alert) => alert.present());
};

const finishSession = async (station: Station) => {
  const allStations = await dataService.setFinishedClientStation(station.id);
  
  stations.items = allStations;
};

const openClientModal = async(stationId: number) => {
  if(stationId == undefined || stationId == null) return;

  form.stationId = stationId
  await addClientModal.value?.$el.present()
}


onMounted(() => {
  loadStations();
});

defineExpose({
  addStation,
});
</script>

<template>
  <div class="container">
    <!-- Grid de Estações -->
    <div v-if="stations.isLoading" class="grid">
      <div v-for="index in 6" :key="`skeleton-${index}`" class="card skeleton-card">
        <div>
          <div class="card-header">
            <div class="card-info">
              <div class="skeleton skeleton-icon"></div>

              <div class="skeleton skeleton-title"></div>
            </div>

            <div class="skeleton skeleton-menu"></div>
          </div>

          <div class="status-row">
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-time"></div>
          </div>
        </div>

        <div class="card-footer">
          <div class="skeleton skeleton-user"></div>
          <div class="skeleton skeleton-price"></div>
        </div>
      </div>
    </div>

    <div v-else>
      <div id="tabs">
        <IonSegment>
          <IonSegmentButton value="all" content-id="all">
            <IonLabel>Todos</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="in_use" content-id="in_use">
            <IonLabel>Em andamento</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="finished" content-id="finished">
            <IonLabel>Finalizados</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>
      
      <IonSegmentView style="margin: 1rem 0;">
        <IonSegmentContent id="all">
          <StationList
            :stations="stations.items"
            @exclude-station="openExcludeStation"
            @finish-session="finishSession"
            :can-assign-clients="true"
            @assign-client="openClientModal"
          />
        </IonSegmentContent>

        <IonSegmentContent id="in_use">
          <StationList
            :stations="inUseStations"
            @exclude-station="openExcludeStation"
            @finish-session="finishSession"
          />
        </IonSegmentContent>

        <IonSegmentContent id="finished">
          <StationList
            :stations="finishedStations"
            @exclude-station="openExcludeStation"
            @finish-session="finishSession"
          />
        </IonSegmentContent>
      </IonSegmentView>
    </div>

  </div>
  <IonModal ref="addClientModal" class="max" :backdrop-dismiss="false">
    <header>
      <span class="title">Novo cliente</span>
      <IonButton
        fill="clear"
        style="color: #fff"
        size="small"
        slot="start"
        @click="addClientModal.$el.dismiss();
        "
      >
        <IonIcon :icon="close" style="color: #fff"></IonIcon>
      </IonButton>
    </header>
    <div class="container" style="margin: 0">
      <div style="display: flex; align-items: center; gap: 1rem">
        <form method="post" style="display: flex; flex-direction: column; gap: 10px" @submit.prevent="newClient">
          <div>
            <label for="user">Nome do cliente (opcional)</label>
            <input type="text" name="user" id="user" v-model="form.user" />
          </div>

          <input type="text" name="name" id="name" v-model="form.title" hidden />

          <input type="text" v-model="form.status" hidden />
          <div>
            <label for="time">Horas de uso</label>
            <TimeInput :initial-seconds="form.time || 0" :running="form.status === 'in_use'" @update:seconds="form.time = $event" />
          </div>

          <div>
            <label for="price">Valor total a ser pago</label>
            <input
              type="text"
              :value="
                price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              "
              disabled
            />
            <span class="title" style="color: #666"> Valor por hora: {{ (appConfig as any).pricePerHour }} </span>
          </div>

          <div>
            <button type="submit" class="light" :disabled="stations.isLoading">
              <template v-if="stations.isLoading">
                <IonSpinner name="dots" color="#fff"></IonSpinner>
              </template>
              <template v-else>
                <span>Reservar estação</span>
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </IonModal>
  <IonModal ref="addStationModal" class="max" :backdrop-dismiss="false">
    <header>
      <span class="title">Nova estação</span>
      <IonButton
        fill="clear"
        style="color: #fff"
        size="small"
        slot="start"
        @click="
          addStationModal.$el.dismiss();
        "
      >
        <IonIcon :icon="close" style="color: #fff"></IonIcon>
      </IonButton>
    </header>
    <div class="container">
      <form method="post" @submit.prevent="newStation" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
        <div>
          <label for="title">Título da estação</label>
          <input type="text" name="title" id="title" v-model="form.title" required />
        </div>

        <div>
          <label for="status">Status</label>
          <select name="status" id="status" v-model="form.status">
            <option value="free">Livre</option>
            <option value="in_use">Ocupada</option>
            <option value="maintenance">Manutenção</option>
          </select>
        </div>

        <button type="submit" class="light" :disabled="stations.isLoading" style="align-self: flex-end;">
          <template v-if="stations.isLoading">
            <IonSpinner name="dots" color="#fff"></IonSpinner>
          </template>
          <template v-else>
            <span>Adicionar estação</span>
          </template>
        </button>
      </form>
    </div>
  </IonModal>
</template>
<style scoped>

.container {
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Grid de estações */
.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Cards */
.card {
  border: 1px solid #e5e7eb1e;
  background: #161616;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Rodapé do card */
.card-footer {
  min-height: 40px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #f3f4f62c;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Skeleton */
.skeleton-card {
  min-height: 140px;
}

.skeleton {
  background: linear-gradient(
    90deg,
    #242424 25%,
    #303030 50%,
    #242424 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.skeleton-title {
  width: 100px;
  height: 16px;
}

.skeleton-menu {
  width: 24px;
  height: 24px;
}

.skeleton-badge {
  width: 90px;
  height: 20px;
}

.skeleton-time {
  width: 70px;
  height: 16px;
}

.skeleton-user {
  width: 110px;
  height: 14px;
}

.skeleton-price {
  width: 70px;
  height: 14px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.start-btn {
  width: 100%;
  background-color: #161f28;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-btn:hover {
  background-color: #202c38;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* Modal */
ion-modal header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}


ion-modal form {
  width: 100%;
}

ion-modal input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: #202020;
  color: #fff;
  font-size: 0.875rem;
  outline: none;
}

ion-modal input:focus {
  border-color: #749be1;
}

ion-modal input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

#tabs ion-segment-button {
  --indicator-color: #ffffff6e;
  --color: #888888;
  --color-focused: #afafaf;
  --color-checked: #bebebe;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
