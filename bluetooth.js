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

// this function is an example of how the original desktop app sends info through bluetooth
function send(direction, leftTries) {
  if (!myCharacteristic) {
      return;
  }
  let encoder = new TextEncoder('utf-8');
  if (direction == "stop") {
      console.log("stop");
      let sendMsg = encoder.encode("stop");
      myCharacteristic.writeValue(sendMsg);
  }
  if (direction == "forward") {
      console.log("forward");
      let sendMsg = encoder.encode("forward");
      myCharacteristic.writeValue(sendMsg);
  }
  if (direction == "back") {
      console.log("back");
      let sendMsg = encoder.encode("back");
      myCharacteristic.writeValue(sendMsg);
  }
  if (direction == "left") {
      console.log("left");
      let sendMsg = encoder.encode("left");
      myCharacteristic.writeValue(sendMsg);
  }
  if (direction == "right") {
      console.log("right");
      let sendMsg = encoder.encode("right");
      myCharacteristic.writeValue(sendMsg);
  }
  if (direction == "battery") {
      console.log("battery");
      let sendMsg = encoder.encode("battery");
      myCharacteristic.writeValue(sendMsg);
  }
}