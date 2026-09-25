<script setup lang="ts">
import { IonButton } from '@ionic/vue';
//@ts-ignore
import { computed, defineProps, ref, watch } from 'vue';

interface FilterStationsProps {
  searchStation: string;
  searchClient: string;
  filterStatus: string;
}

const props = defineProps<FilterStationsProps>();

const emit = defineEmits(['update:searchStation', 'update:searchClient', 'update:filterStatus', 'clearFilters']);

const debouncedStation = ref(props.searchStation);
const debouncedClient = ref(props.searchClient);
const debouncedStatus = ref(props.filterStatus);

// Create debounced refs with watchers
const debouncedSearchStation = computed({
  get: () => debouncedStation.value,
  set: (value: string) => {
    debouncedStation.value = value;
    emit('update:searchStation', value);
  },
});

const debouncedSearchClient = computed({
  get: () => debouncedClient.value,
  set: (value: string) => {
    debouncedClient.value = value;
    emit('update:searchClient', value);
  },
});

const debouncedFilterStatus = computed({
  get: () => debouncedStatus.value,
  set: (value: string) => {
    debouncedStatus.value = value;
    emit('update:filterStatus', value);
  },
});

// Watch for external prop changes and update internal state
watch(
  () => props.searchStation,
  (newValue) => {
    debouncedStation.value = newValue;
  }
);

watch(
  () => props.searchClient,
  (newValue) => {
    debouncedClient.value = newValue;
  }
);

watch(
  () => props.filterStatus,
  (newValue) => {
    debouncedStatus.value = newValue;
  }
);

function clearFilters() {
  emit('clearFilters');
}

const hasActiveFilters = computed(() => {
  return debouncedSearchStation.value.trim() !== '' || debouncedSearchClient.value.trim() !== '' || debouncedFilterStatus.value !== 'all';
});
</script>

<template>
  <!-- Filter UI remains the same -->
  <div class="filters">
    

    <div class="filters__grid">
      <div class="field field--search">
        <label class="field__label" for="filter-station">Estação</label>
        <input
          id="filter-station"
          v-model="debouncedSearchStation"
          type="search"
          class="field__input"
          name="search-station"
          placeholder="Buscar estação"
        />
      </div>

      <div class="field field--search">
        <label class="field__label" for="filter-client">Cliente</label>
        <input
          id="filter-client"
          v-model="debouncedSearchClient"
          type="search"
          class="field__input"
          name="search-client"
          placeholder="Buscar cliente"
        />
      </div>

      <div class="field">
        <label class="field__label" for="filter-status">Status</label>

        <select v-model="debouncedFilterStatus" name="filter-status" id="filter-status">
          <option value="all">Todos</option>
          <option value="free">Livre</option>
          <option value="in_use">Ocupado</option>
        </select>

        <IonButton v-if="hasActiveFilters" fill="clear" type="button" class="filters__clear" @click="clearFilters"> Limpar filtros </IonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  border-radius: var(--border-radius);
  border: 1px solid var(--ion-color-light-shade);

  & .field {
    width: 50%;
  }

}

.filters__grid {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) { 
    flex-direction: column;

    & .field {
      width: auto;
    }
  }
}

.filters__title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.filters__clear {
  margin-left: auto;
  --background: var(--ion-color-danger-tint);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field--search {
  grid-column: span 1;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters__clear {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .filters__grid {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .field--search {
    grid-column: span 1;
  }
}

ion-segment {
  --indicator-color: var(--ion-color-primary);
  --background: var(--ion-color-light);
  --button-background: var(--ion-color-light);
  border-radius: var(--border-radius);
}

ion-segment-button {
  --background: transparent;
  --background-checked: var(--ion-color-primary);
  --color: var(--ion-color-medium-contrast);
  --color-checked: white;
  --padding-start: 16px;
  --padding-end: 16px;
  border-radius: var(--border-radius);
}


</style>
