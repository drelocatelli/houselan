<script setup lang="ts">
import { db } from '@/services/database.service';
import { actionSheetController, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/vue';
import { onBeforeMount, ref } from 'vue';

const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development'

const addComputerModal = ref(null)
const selectModal = ref(null)
const selectedIdx = ref(null)

const computers = ref([])


onBeforeMount(() => {
    loadComputers()
})

const loadComputers = async() => {
    try {
        const computerList = await db.computers?.toCollection().toArray()

        // preenche modo dev com 3 computadores
        if(isDev && computerList?.length === 0) {
            for(let i = 0; i < 3; i++) {
                await db.computers?.add({
                    title: `PC-0${i + 1}`,
                });
            }
        }

        computers.value = computerList;            
        
    } catch(err) {
        console.error(err)
    }
}

const addComputer = async() => {
    try {
        const storeTitle = `PC-${(computers.value.length + 1).toString().padStart(2, '0')}`
        await db.computers?.add({
            title: storeTitle,
        })
        await loadComputers()
    } catch(err) {
        console.error(err)
    }
}

const selectStation = (station: any) => {
    console.log({station})
    selectModal.value.$el.present()
}

const removeComputer = async(id: number) => {
    try {
        const computer = await db.computers.toArray()
        const found = computer.find(comp => comp.id === id)

        if(found) {
            await db.computers.delete(found.id)
        }
        await loadComputers()

        selectModal.value.$el.dismiss()
    } catch(err) {
        console.error(err)
    }
}

const removeAllComputers = async() => {
    try {
        actionSheetController.create({
            header: 'Tem certeza que deseja remover todos os computadores?',
            cssClass: 'remove-computers-action-sheet',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Continuar',
                    role: 'destructive',
                    handler: async() => {
                        await db.computers.clear()
                        await loadComputers()
                    }
                }
            ]
        }).then(el => {
            el.present()
        })
    } catch(err) {
        console.error(err)
    }
}

</script>

<template>
    <div id="main-computers">   
        <h1>Computadores</h1>
        <div style="display: flex; gap: 5px;">
            <IonButton fill="solid" class="default-btn" @click="addComputer">Adicionar computador</IonButton>
            <IonButton fill="solid" color="danger" class="default-btn" @click="removeAllComputers">Remover todos computadores</IonButton>
        </div>
    </div>
    <div id="computers">
        <div class="computer" v-for="(computer, index) in computers" :key="index" @click="selectedIdx = index" :class="{selected: selectedIdx === index}" @dblclick="selectStation(computer)">
            <img src="/computer.webp" alt="" width="120px">
            <span style="text-align: center; font-weight: bold;">
                {{ `PC-0${index + 1}` }}
            </span>
        </div>
    </div>
    <IonModal ref="addComputerModal" :backdrop-dismiss="false">
        <IonHeader>
            <IonToolbar>
                <IonTitle>Adicionar computador</IonTitle>
                <IonButtons slot="end">
                    <IonButton @click="addComputerModal.$el.dismiss()">Fechar</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <form method="post">
                <IonInput
                    placeholder="Digite um título"
                >
                </IonInput>
            </form>
        </IonContent>
    </IonModal>

    <IonModal ref="selectModal" :backdrop-dismiss="false">
        <IonHeader>
            <IonToolbar>
                <IonTitle>{{ computers[selectedIdx].name }}</IonTitle>
                <IonButtons slot="end">
                    <IonButton @click="selectModal.$el.dismiss()">Fechar</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonButton color="danger" @click="removeComputer(computers[selectedIdx].id)">Remover computador</IonButton>
        </IonContent>
    </IonModal>
</template>

<style scoped>
#computers {
    display: flex;
    gap: 3rem;
    justify-content: center;
    align-items: center;
    height: 100%;
    user-select: none; 
    flex-wrap: wrap;
    margin: 1rem 3rem;
    
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