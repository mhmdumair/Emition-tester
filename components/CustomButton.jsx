import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title,handlepress,containerStyle,textStyles}) => {
  return (
    <TouchableOpacity className={`bg-[#0855B1] rounded-xl justify-center items-center ${containerStyle}  `}
    onPress={handlepress}
    activeOpacity = {0.7}
  
    >
        <Text className={`text-[#EAEAEA]  font-psemibold  ${textStyles}`}>
           {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton;