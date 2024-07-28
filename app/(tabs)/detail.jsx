import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../contaxt/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './../../components/CustomButton';
import Display from '../../components/Display';
import { addTestToDb } from '../../db/firebaseConfig';
import { BleManager } from 'react-native-ble-plx';

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
              setTimeout(() => {
                setPopup("");
              }, 3000);
              return device.discoverAllServicesAndCharacteristics();
            })
            .catch(error => {
              console.error("Error connecting or discovering services:", error);
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
    }
  };

  const handleSave = async () => {
    try {
      if (data) {
        const newDocId = await addTestToDb(data);
        console.log("New test document ID:", newDocId);
        setPopup("Successfully Saved");
        setTimeout(() => {
          setPopup("");
        }, 3000);
      } else {
        console.log("No data to save.");
      }
    } catch (error) {
      console.error("Error saving test data:", error);
    }
  };

  // Decode function (updated for comma-separated values)
  const decode = (value) => {
    // Assuming the value is a base64 encoded string
    const decodedString = Buffer.from(value, 'base64').toString('utf8');
    const [co, hc] = decodedString.split(',');

    return {
      co: co.trim(),
      hc: hc.trim(),
      result: "Pass", // Example static result, adjust as needed
      additionalDetails: "You should check regularly to maintain your Vehicle Condition" // Example static details
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
