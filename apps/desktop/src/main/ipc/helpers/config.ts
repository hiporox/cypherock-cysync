export const ipcConfig = {
  methods: {
    logWithServiceAndLevel: 'logger:logWithServiceAndLevel',
    getDevices: 'device:list',
    connectDevice: 'device:connect',
    connectedDeviceMethodCall: 'device:method:call',
    dbMethodCall: 'db:method:call',
    dbMethodList: 'db:method:list',
    keyDbMethodCall: 'keydb:method:call',
    keyDbMethodList: 'keydb:method:list',
    checkForUpdates: 'autoUpdater:checkForUpdates',
    downloadUpdate: 'autoUpdater:downloadUpdate',
    installUpdates: 'autoUpdater:installUpdate',
  },
  listeners: {
    downloadUpdateProgress: 'autoUpdater:downloadUpdate:progress',
    downloadUpdateCompleted: 'autoUpdater:downloadUpdate:completed',
    downloadUpdateError: 'autoUpdater:downloadUpdate:error',
  },
  // Environment variables to inject in renderer
  env: [
    'LOG_LEVEL',
    'BUILD_TYPE',
    'API_CYPHEROCK',
    'BUILD_VERSION',
    'IS_PRODUCTION',
    'IS_TEST',
    'USER_DATA_PATH',
    'ALLOW_PRERELEASE',
    'VERSION',
    'CHANNEL',
    'RELEASE_NOTES',
    'OS',
  ],
};
