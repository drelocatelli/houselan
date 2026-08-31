<script setup>
import { IonButton, IonIcon } from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import { ref } from 'vue';

const getStatusLabel = (status) => {
  const labels = {
    in_use: 'Em uso',
    free: 'Livre',
    maintenance: 'Manutenção'
  };
  return labels[status] || status;
};

const stations = ref(
    []
    // [
    //     { id: 1, title: 'PC-1213342', status: 'in_use', time: '01h 18m', user: 'Lucas Andrade', price: 'R$ 8,00' },
    //     { id: 2, title: 'PC-1213343', status: 'in_use', time: '00h 00m', user: 'Cliente avulso', price: 'R$ 0,00' },
    //     { id: 3, title: 'PC-1213344', status: 'in_use', time: '02h 06m', user: 'Mariana Lima', price: 'R$ 12,00', hasMenu: true },
    //     { id: 4, title: 'PC-1213345', status: 'in_use', time: '00h 44m', user: 'João Pedro', price: 'R$ 5,00' },
    //     { id: 5, title: 'PC-1213346', status: 'free' },
    //     { id: 6, title: 'PC-1213347', status: 'maintenance' },
    //     { id: 7, title: 'PC-1213348', status: 'in_use', time: '01h 32m', user: 'Ana Clara', price: 'R$ 9,50' },
    //     { id: 8, title: 'PC-1213349', status: 'free' },
    //     { id: 9, title: 'PC-1213350', status: 'in_use', time: '02h 48m', user: 'Bruno Costa', price: 'R$ 16,00' }
    // ]
);
</script>


<template>
  <div class="container">
    <!-- Grid de Estações -->
    <div class="grid">
      <div 
        v-for="station in stations" 
        :key="station.id"
        class="card"
      >
        <!-- Topo do Card -->
        <div>
          <div class="card-header">
            <div class="card-info">
              <!-- Ícone dinâmico por status -->
              <div class="icon-box" :class="station.status">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span class="station-code">{{ station.title }}</span>
              </div>
            </div>

            <button v-if="station.hasMenu" class="menu-btn">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>

          <!-- Status Badge + Tempo -->
          <div class="status-row">
            <span class="badge" :class="station.status">
              <span class="dot"></span>
              {{ getStatusLabel(station.status) }}
            </span>
            <span v-if="station.time" class="time">{{ station.time }}</span>
          </div>
        </div>

        <!-- Rodapé do Card -->
        <div class="card-footer">
          <!-- Se em uso -->
          <template v-if="station.status === 'in_use'">
            <span class="user-name">{{ station.user }}</span>
            <span class="price">{{ station.price }}</span>
          </template>

          <!-- Se manutenção -->
          <template v-else-if="station.status === 'maintenance'">
            <span class="unavailable">Indisponível para uso</span>
          </template>

          <!-- Se livre -->
          <template v-else-if="station.status === 'free'">
            <IonButton fill="clear" class="start-btn">
              <IonIcon :icon="checkmark" style="margin-right: 10px;"></IonIcon>
              <span>
                  Iniciar sessão
              </span>
            </IonButton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

/* Grid */
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

/* Card */
.card {
  border: 1px solid #e5e7eb1e;
  background: #161616;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.in_use {
  background-color: #2960a865;
  color: #3b82f6;
}

.icon-box.free {
  background-color: #10b98165;
  color: #10b981;
}

.icon-box.maintenance {
  background-color: #f59e0b65;
  color: #f59e0b;
}

.station-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.25;
}

.station-code {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.menu-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
}

.menu-btn:hover {
  color: #4b5563;
}

.icon {
  width: 20px;
  height: 20px;
}

/* Status Row */
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.in_use {
  background-color: #2563eb30;
  color: #2563eb;
}

.badge.free {
  background-color: #2563eb30;
  color: #059669;
}

.badge.maintenance {
  background-color: #d9770630;
  color: #d97706;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge.in_use .dot { background-color: #2563eb; }
.badge.free .dot { background-color: #059669; }
.badge.maintenance .dot { background-color: #d97706; }

.time {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

/* Footer */
.card-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #f3f4f62c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
}

.user-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.price {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
}

.unavailable {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
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
</style>