var myCharacteristic;

function onButtonClick() {

    let options = {};
  
    options.filters = [{namePrefix: "Piël"}];
  
    options.optionalServices = ["00001530-1212-efde-1523-785feabcd123"]
  
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
      return server.getPrimaryService("00001530-1212-efde-1523-785feabcd123");
    })
    .then(service => {
      return service.getCharacteristics();
    })
    .then(characteristics => {
      let queue = Promise.resolve();
      characteristics.forEach(characteristic => {
        switch (characteristic.uuid) {
          // RX characteristic
          case BluetoothUUID.getCharacteristic('00001534-1212-efde-1523-785feabcd123'):
            queue = queue.then(_ => characteristic.startNotifications()).then(value => {
              console.log('> Notifications started');
              characteristic.addEventListener('characteristicvaluechanged',
              handleNotifications);
            });
            break;
          // TX characteristic
          case BluetoothUUID.getCharacteristic('00001531-1212-efde-1523-785feabcd123'):
            queue = queue.then(_ => myCharacteristic = characteristic);
            break;
          default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
        }
      });
    })
    .catch(error => {
      console.log('Argh! ' + error);
    });
  }
