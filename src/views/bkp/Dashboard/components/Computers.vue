<script setup lang="ts">
import { db } from '@/services/database.service';
import { actionSheetController, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

const selectModal = ref(null);
const selectedId = ref(null);

const computers = ref([]);

onBeforeMount(() => {
  loadComputers();
});

const loadComputers = async () => {
  try {
    const computerList = await db.computers?.toCollection().toArray();
    computers.value = computerList;
  } catch (err) {
    console.error(err);
  }
};

const addComputer = async () => {
  try {
    const storeTitle = `PC-${(computers.value.length + 1).toString().padStart(2, '0')}`;

    const ids = computers.value.map((comp) => Number(comp.id)).filter(Number.isFinite);
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    const payload = {
      title: storeTitle,
      id: nextId,
    } as any;

    await db.computers?.add(payload);
    await loadComputers();
  } catch (err) {
    console.error(err);
  }
};

const selectStation = () => {
  selectModal.value.$el.present();
};

const removeComputer = async (id: number) => {
  try {
    const computer = await db.computers.toArray();
    const found = computer.find((comp) => comp.id === id);

    if (found) {
      actionSheetController
        .create({
          header: `Tem certeza que deseja remover o computador ${found.title}?`,
          cssClass: 'remove-computer-action-sheet',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              },
            },
            {
              text: 'Continuar',
              role: 'destructive',
              handler: async () => {
                await db.computers.delete(found.id);
                await loadComputers();
                selectModal.value.$el.dismiss();
              },
            },
          ],
        })
        .then((el) => el.present());
    }
  } catch (err) {
    console.error(err);
  }
};

const removeAllComputers = async () => {
  try {
    actionSheetController
      .create({
        header: 'Tem certeza que deseja remover todos os computadores?',
        cssClass: 'remove-computers-action-sheet',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: async () => {
              await db.computers.clear();
              await loadComputers();
            },
          },
        ],
      })
      .then((el) => {
        el.present();
      });
  } catch (err) {
    console.error(err);
  }
};

const updateComputer = async (event: Event) => {
  try {
    const form = new FormData(event.target as HTMLFormElement) as any
    const payload = Object.fromEntries(form.entries())

    const computer = await db.computers.toArray();
    const found = computer.find((comp) => comp.id === selectedId.value);
    
    if(found) {
        await db.computers.update(found.id, {title: payload.title})
      
        console.log({found, payload})
    }


    await loadComputers();
    selectModal.value.$el.dismiss();
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div id="main-computers">
    <h1>Computadores</h1>
    <div style="display: flex; gap: 5px">
      <IonButton fill="solid" class="default-btn" @click="addComputer">Adicionar computador</IonButton>
      <IonButton fill="solid" color="danger" class="default-btn" @click="removeAllComputers">Remover todos computadores</IonButton>
    </div>
  </div>
  <ul id="computers-list">
    <TransitionGroup name="computers">
      <li
        class="computer"
        v-for="computer in computers"
        :key="computer.id"
        @click="selectedId = computer.id"
        :class="{ selected: selectedId === computer.id }"
        @dblclick="selectStation"
      >
        <img src="/computer.webp" alt="" width="120px" />
        <span style="text-align: center; font-weight: bold">
          {{ 
                computer.title 
                ? computer.title
                : `PC-${computer.id?.toString().padStart(2, '0')}`
            }}
        </span>
      </li>
    </TransitionGroup>
  </ul>
  <IonModal ref="selectModal" :backdrop-dismiss="false">
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ computers.find((computer) => computer.id === selectedId)?.title }}</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="selectModal.$el.dismiss()">Fechar</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <form @submit.prevent="updateComputer">
        <IonItem>
          <IonLabel position="stacked"> Título </IonLabel>

          <IonInput name="title" :value="computers.find((computer) => computer.id === selectedId)?.title" type="text" placeholder="Digite o título do computador" required />
        </IonItem>

        <IonButton expand="block" type="submit" class="ion-margin-top"> Salvar alterações </IonButton>

        <IonButton expand="block" color="danger" type="button" class="ion-margin-top" @click="removeComputer(selectedId)">
          Remover computador
        </IonButton>
      </form>
    </IonContent>
  </IonModal>
</template>

<style scoped>
#computers-list {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
  height: 100%;
  user-select: none;
  flex-wrap: wrap;
  margin: 1rem 3rem;
  /* height: max-content; */
  overflow-y: auto;

  & .computer {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: scale 0.2s ease-in-out;

    &.selected {
      background-color: rgb(50, 62, 235);
      border-radius: 5px;
    }

    &:hover {
      scale: 1.1;
    }
  }
}

#main-computers {
  display: flex;
  justify-content: space-between;
  margin: 1rem 3rem;
  align-items: center;
}
.computers-enter-active,
.computers-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.computers-enter-from,
.computers-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Necessário para os outros itens se moverem quando um item sair */
.computers-move {
  transition: transform 0.5s ease;
}

@media screen and (max-width: 1000px) {
  #main-computers {
    margin: 1rem;
    flex-direction: column;
  }

  #computers {
    gap: 1rem;
    margin: 1rem;
  }
}
</style>
