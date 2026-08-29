require('./rt/electron-rt');
import { contextBridge, ipcRenderer } from 'electron';
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string): void => {
    ipcRenderer.send('open-external', url);
  }
});

contextBridge.exposeInMainWorld('config', {
  read: () => ipcRenderer.invoke('read-properties'),
  set: (key: string, value: string) => ipcRenderer.invoke('set-properties', key, value),
})