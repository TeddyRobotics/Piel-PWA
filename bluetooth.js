var myCharacteristic;

class BLEConnection
{
  constructor(characteristic)
  {
    this.characteristic = characteristic;
    console.log("characteristic: " + this.characteristic.toString());
  }

  send(data)
  {
    this.characteristic.writeValue(data);
  }
}

/* UART Serivce: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E
 * UART RXD    : 6E400002-B5A3-F393-E0A9-E50E24DCCA9E
 * UART TXD    : 6E400003-B5A3-F393-E0A9-E50E24DCCA9E
 * source: https://github.com/adafruit/Adafruit_nRF52_Arduino/blob/master/libraries/Bluefruit52Lib/src/services/BLEUart.cpp
 */

var bleConnection;

function onButtonClick() {
  // source: https://github.com/adafruit/Adafruit_nRF52_Arduino/blob/master/libraries/Bluefruit52Lib/src/services/BLEUart.cpp
  const DFU_SERVICE = {
    
    UUID: "00001530-1212-efde-1523-785feabcd123",
    DFU_CONTROL_POINT: "00001531-1212-efde-1523-785feabcd123",
    DFU_PACKET: "00001532-1212-efde-1523-785feabcd123",
    
  };

  /*
  UUID: "00001530-1212-efde-1523-785feabcd123",
    DFU_CONTROL_POINT: "00001531-1212-efde-1523-785feabcd123",
    DFU_PACKET: "00001532-1212-efde-1523-785feabcd123",
    */
  let options = {};
  options.filters = [
    {namePrefix: "Piël"},
    {services: [DFU_SERVICE.UUID]}
  ];
  options.optionalServices = [DFU_SERVICE.UUID];

  console.log('Requesting Bluetooth Device...');
  console.log('with ' + JSON.stringify(options));
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
    console.log('> Connected:        ' + device.gatt.connected);
    return device.gatt.connect();
  })
  .then(server => {
    // UART service
    // return server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    return server.getPrimaryService(DFU_SERVICE.UUID);
  })
  .then(service => {
    return service.getCharacteristics();
  })
  .then(characteristics => {
    // let queue = Promise.resolve();
    characteristics.forEach(characteristic => {
      console.log(characteristic);
      switch (characteristic.uuid) {
      //   // TX characteristic
      //   // case BluetoothUUID.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e'):
      //   case BluetoothUUID.getCharacteristic(UART.TXD):
      //     queue = queue.then(_ => characteristic.startNotifications()).then(value => {
      //       console.log('> Notifications started');
      //       characteristic.addEventListener('characteristicvaluechanged',
      //       handleNotifications);
      //     });
      //     break;
        
      //   // RX characteristic
      //   // case BluetoothUUID.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'):
      //   case BluetoothUUID.getCharacteristic(UART.RXD):
      //     queue = queue.then(_ => bleConnection = new BLEConnection(characteristic));
      //     break;
        case BluetoothUUID.getCharacteristic(DFU_SERVICE.DFU_VERSION):
          queue = queue.then(_ => characteristic.startNotifications()).then(value => {
            console.log("Notification started");
            characteristic.addEventListener('characteristicvaluechanged',
                                            handleNotifications);
          });
        default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
      }
    });
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function handleNotifications(event) {
  let value = event.target.value;
  let decoder = new TextDecoder('utf-8');
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  // document.getElementById("battery_label").innerHTML = decoder.decode(value);
  // console.log('> ' + a.join(' '));
  let msg = decoder.decode(value);
  console.log(msg);
}

function send(data)
{
  bleConnection.send(data);
}
