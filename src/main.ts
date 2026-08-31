import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router);


async function configureSafeArea() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const result = await SafeArea.getSafeAreaInsets();
    const { insets } = result;

    const root = document.documentElement;

    root.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
    root.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
    root.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`);
    root.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
  } catch (error) {
    console.error('Erro ao obter a Safe Area:', error);
  }
}

  
  router.isReady().then(async() => {
    await configureSafeArea();
    app.mount('#app');
});
