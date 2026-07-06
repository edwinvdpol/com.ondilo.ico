'use strict';

const { OAuth2Driver } = require('homey-oauth2app');

class Driver extends OAuth2Driver {

  /*
  | Driver events
  */

  // Driver initialized
  async onOAuth2Init() {
    this.recommendationTrigger = this.homey.flow.getDeviceTriggerCard('recommendation_received');

    this.log('Initialized');
  }

  // Driver destroyed
  async onOAuth2Uninit() {
    this.log('Destroyed');
  }

  /*
  | Pairing functions
  */

  // Pair devices
  async onPairListDevices({ oAuth2Client }) {
    this.log(`Pairing ${this.id}s`);

    // Fetch devices from API
    const results = await oAuth2Client.discoverDevices();

	// Convert results to device data
    const devices = results.map((device) => this.getDeviceData(device)).filter((e) => e);

    // Log found devices
    this.log('Found devices', JSON.stringify(devices));

    return devices;
  }

  // Return data to create the device
  getDeviceData(device) {
    const data = {
      name: device.name,
      data: {
        id: device.id,
      },
      settings: {
        volume: `${device.volume} m³`,
      },
    };

    this.log('Device found', JSON.stringify(data));

    return data;
  }

}

module.exports = Driver;
