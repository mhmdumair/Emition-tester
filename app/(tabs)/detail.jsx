import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../contaxt/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './../../components/CustomButton';
import Display from '../../components/Display';
import { addTestToDb } from '../../db/firebaseConfig';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Ensure Buffer is imported

const Detail = () => {
  const [data, setData] = useState(null);
  const { form, setForm } = useGlobalContext();
  const [popup, setPopup] = useState("");
  const [manager, setManager] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const bleManager = new BleManager();
    setManager(bleManager);

    const connectToDevice = async () => {
      bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.error(error);
          return;
        }
        const TARGET_DEVICE_NAME = 'HMSoft';

        if (scannedDevice.name === TARGET_DEVICE_NAME) {
          bleManager.stopDeviceScan();

          scannedDevice.connect()
            .then(device => {
              setDevice(device);
              setPopup("Successfully Connected to the device");
              setTimeout(() => setPopup(""), 3000);
              return device.discoverAllServicesAndCharacteristics();
            })
            .catch(error => {
              console.error("Error connecting or discovering services:", error);
              setPopup("Failed to connect to the device");
              setTimeout(() => setPopup(""), 3000);
            });
        } 
      });

      // Stop scanning after 10 seconds
      setTimeout(() => bleManager.stopDeviceScan(), 10000);
    };

    connectToDevice();

    return () => {
      bleManager.destroy();
    };
  }, []);

  const scan = async () => {
    if (!device) {
      Alert.alert("Device not connected", "Please ensure the Bluetooth device is connected.");
      return;
    }

    const CHARACTERISTIC_UUID = '0xFFE1';
    try {
      const characteristic = await device.readCharacteristicForService('0xFFE0', CHARACTERISTIC_UUID);
      const value = characteristic.value;
      const decodedValue = decode(value); // Use the updated decode function
      setData({
        name: form.name,
        nic: form.nic,
        vehicleNumber: form.vehicleNumber,
        co: decodedValue.co,
        hc: decodedValue.hc,
        time: new Date(),
        result: decodedValue.result,
        additionalDetails: decodedValue.additionalDetails
      });
    } catch (error) {
      console.error("Error reading characteristic:", error);
      Alert.alert("Error", "Failed to read characteristic.");
    }
  };

  const handleSave = async () => {
    try {
      if (data) {
        const newDocId = await addTestToDb(data);
        console.log("New test document ID:", newDocId);
        setPopup("Successfully Saved");
        setTimeout(() => setPopup(""), 3000);
      } else {
        console.log("No data to save.");
      }
    } catch (error) {
      console.error("Error saving test data:", error);
      setPopup("Failed to save data.");
      setTimeout(() => setPopup(""), 3000);
    }
  };

  // Decode function (updated for comma-separated values)
  // Decode function with minimum level checks
const decode = (value) => {
  // Assuming the value is a base64 encoded string
  const decodedString = Buffer.from(value, 'base64').toString('utf8');
  const [co, hc] = decodedString.split(',');

  // Convert to numbers and trim whitespace
  const coLevel = parseFloat(co.trim());
  const hcLevel = parseFloat(hc.trim());

  // Define minimum levels
  const MIN_CO_LEVEL = 1.0; // Replace with your actual minimum level
  const MIN_HC_LEVEL = 2.0; // Replace with your actual minimum level

  let result = "Pass";
  let additionalDetails = "You should check regularly to maintain your vehicle condition";

  // Determine the result and additional details
  if (coLevel > MIN_CO_LEVEL || hcLevel > MIN_HC_LEVEL) {
    result = "Fail";
    additionalDetails = `Failed due to high levels. CO: ${coLevel}, HC: ${hcLevel}. Ensure your vehicle is maintained properly.`;
  }

  return {
    co: coLevel.toFixed(2),
    hc: hcLevel.toFixed(2),
    result,
    additionalDetails
  };
};


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center">
          <Text className="text-3xl text-secondary-200 font-psemibold my-8 text-center">
            Hi {form.name}
          </Text>

          {data ? (
            <Display data={data} />
          ) : (
            <View className="justify-center items-center w-[90%] h-fit min-h-[450px] bg-white rounded-xl p-4">
              <Text className="text-[18px]">
                Scan for Your Test Results
              </Text>
            </View>
          )}

          <View className="w-full flex-row mx-3 justify-between px-5 mt-10">
            <CustomButton
              title="Scan"
              containerStyle="w-[47%] min-h-[60px]"
              textStyles="text-xl"
              handlepress={scan}
            />

            <CustomButton
              title="Save"
              containerStyle="w-[47%] min-h-[60px]"
              textStyles="text-xl"
              handlepress={handleSave}
            />
          </View>
        </View>

        {popup && (
          <Text className="text-base text-green-500 mt-4 text-center">
            {popup}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Detail;
