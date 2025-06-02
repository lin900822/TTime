import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    logInfoEvent
    logLearnEvent
    logErrorEvent
    getSystemTypeEvent
    openSetPageEvent
    jumpToPage
    showMsgEvent
    cacheHas
    cacheGet
    cacheSet
    cacheDelete
    textWriteShearPlateEvent
    logoutEvent
  }
}
