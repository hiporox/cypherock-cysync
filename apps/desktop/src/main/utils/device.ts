import { createLoggerWithPrefix } from '@cypherock/cysync-utils';
import { SDK } from '@cypherock/sdk-core';
import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerialPort } from '@cypherock/sdk-hw-serialport';
import {
  ConnectionTypeMap,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { logger as baseLogger } from './logger';

const logger = createLoggerWithPrefix(baseLogger, 'DeviceConnection');

let connectedDevice:
  | { device: IDevice; connection: IDeviceConnection }
  | undefined;

export const removeConnectedDevice = async () => {
  if (connectedDevice) {
    await connectedDevice.connection.destroy();
    connectedDevice = undefined;
  }
};

export const connectDevice = async (device: IDevice) => {
  await removeConnectedDevice();
  let connection: IDeviceConnection;

  if (device.type === ConnectionTypeMap.HID) {
    connection = await DeviceConnectionHID.connect(device);
  } else {
    connection = await DeviceConnectionSerialPort.connect(device);
  }

  connectedDevice = { device, connection };
  return connectedDevice;
};

export const getConnectedDevice = () => connectedDevice;

export const abortAndRemoveConnectedDevice = async () => {
  try {
    logger.debug('DeviceCleanup Started');

    if (!connectedDevice) {
      logger.debug('DeviceCleanup Not required');
      return;
    }

    const isConnected = await connectedDevice.connection.isConnected();

    logger.debug('DeviceCleanup Connection status', { isConnected });
    if (!isConnected) {
      await connectedDevice.connection.destroy();
      return;
    }

    const sdk = await SDK.create(connectedDevice.connection, 0);
    await sdk.sendAbort();
    await sdk.destroy();
  } catch (error) {
    logger.warn('Error while device connection cleanup');
    logger.warn(error);
  }
};