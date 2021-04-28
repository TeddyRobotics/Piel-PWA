var myCharacteristic;

function onButtonClick() {

    let options = {};
  
    options.filters = [{namePrefix: "Piël"}];
  
    options.optionalServices = ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"]
  
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
      return server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    })
    .then(service => {
      return service.getCharacteristics();
    })
    .then(characteristics => {
      let queue = Promise.resolve();
      characteristics.forEach(characteristic => {
        switch (characteristic.uuid) {
          // RX characteristic
          case BluetoothUUID.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e'):
            queue = queue.then(_ => characteristic.startNotifications()).then(value => {
              console.log('> Notifications started');
              characteristic.addEventListener('characteristicvaluechanged',
              handleNotifications);
            });
            break;
          // TX characteristic
          case BluetoothUUID.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'):
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
