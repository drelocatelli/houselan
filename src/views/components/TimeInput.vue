<script setup lang="ts">
import { computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    initialSeconds?: number;
    running?: boolean;
    disabled?: boolean;
  }>(),
  {
    initialSeconds: 0,
    running: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (event: 'update:seconds', value: number): void;
}>();

const normalizeSeconds = (value: number) => {
  return Math.max(0, Number.isFinite(value) ? value : 0);
};

const hours = computed(() => {
  return Math.floor(normalizeSeconds(props.initialSeconds) / 3600);
});

const minutes = computed(() => {
  return Math.floor((normalizeSeconds(props.initialSeconds) % 3600) / 60);
});

const hoursValue = computed({
  get: () => String(hours.value).padStart(2, '0'),
  set: (value: string) => {
    const newHours = Math.max(0, Number(value) || 0);

    emit(
      'update:seconds',
      newHours * 3600 + minutes.value * 60
    );
  },
});

const minutesValue = computed({
  get: () => String(minutes.value).padStart(2, '0'),
  set: (value: string) => {
    let newMinutes = Number(value) || 0;

    if (newMinutes > 59) {
      newMinutes = 59;
    }

    if (newMinutes < 0) {
      newMinutes = 0;
    }

    emit(
      'update:seconds',
      hours.value * 3600 + newMinutes * 60
    );
  },
});

watch(
  () => props.running,
  (running) => {
    if (running) {
      // O componente não altera o tempo automaticamente.
      // Este campo apenas fica bloqueado enquanto estiver em uso.
    }
  }
);
</script>

<template>
  <div class="time-input">
    <input
      v-model="hoursValue"
      type="number"
      min="0"
      step="1"
      inputmode="numeric"
      :disabled="disabled || running"
      aria-label="Horas"
    />

    <span>:</span>

    <input
      v-model="minutesValue"
      type="number"
      min="0"
      max="59"
      step="1"
      inputmode="numeric"
      :disabled="disabled || running"
      aria-label="Minutos"
    />
  </div>
</template>

<style scoped>
.time-input {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-input input {
  width: 64px;
  height: 40px;
  padding: 0 8px;
  box-sizing: border-box;
  text-align: center;
  font-size: 18px;
}

.time-input span {
  font-size: 20px;
  font-weight: bold;
}

.time-input input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
