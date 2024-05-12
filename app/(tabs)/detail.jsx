import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../../contaxt/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from './../../components/CustomButton'
import Display from '../../components/Display'
import { addTestToDb } from '../../db/firebaseConfig'

const detail = () => {


  const [data,setData] = useState(null)
  const {form,setForm}  = useGlobalContext()
  const [popup,setPopup] = useState("")

  const scan = ()=>{
    setData({
      name : form.name,
      nic : form.nic,
      vehicleNumber : form.vehicleNumber,
      co:"5%",
      hc : "12%",
      time : new Date(),
      result : "Pass",
      additionalDetails : "You should check regularly to maintain your Vehicle Condition"
    })
  }

  const handleSave = async () => {
    try {
      if (data) {
        const newDocId = await addTestToDb(data);
        console.log("New test document ID:", newDocId);
        setPopup("Successfully Saved")
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

  return (
    <SafeAreaView className = "bg-primary h-full">
      <ScrollView>

        <View className ="w-full justify-center items-center">
          <Text className ="text-3xl text-secondary-200 font-psemibold my-8 text-center">
            Hi  {form.name}
          </Text>

          {data ? (<Display
            data = {data}
          />):
          (
          <View className = "justify-center items-center w-[90%] h-fit min-h-[450px] bg-white rounded-xl p-4">
            <Text className = "text-[18px]">
              Scan for Your Test Results</Text>
          </View>
          )}

          <View className = "w-full flex-row mx-3 justify-between px-5 mt-10">
            <CustomButton
              title="Scan"
              containerStyle = "w-[47%] min-h-[60px]"
              textStyles="text-xl"
              handlepress={()=>scan()}
            />

            <CustomButton
              title="Save"
              containerStyle = "w-[47%] min-h-[60px]"
              textStyles="text-xl"
              handlepress={handleSave}
            />
          </View>
        </View>

        {popup && <Text className = "text-base text-green-500 mt-4 text-center">
          {popup}
        </Text>}

      </ScrollView>
    
    </SafeAreaView>
  )
}

export default detail