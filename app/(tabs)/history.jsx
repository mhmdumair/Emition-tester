import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../contaxt/GlobalProvider'
import empty from './../../assets/icons/empty.png'
import ListItem from '../../components/ListItem'
import { getAll, getAllTestDocs } from '../../db/firebaseConfig'

const history = () => {

  const [historyData, setHistoryData] = useState([])

  const {form} = useGlobalContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllTestDocs();
        const search = result.filter(data=>data.vehicleNumber == form.vehicleNumber)
        setHistoryData(search);
      } catch (error) {
        console.error('Error fetching test history:', error.message);
        setHistoryData([]);
      }
    };

    fetchData(); 

  }, []);
  

  return (
    <SafeAreaView  className = "bg-primary h-full">
      <ScrollView>

        <View>

          <Text className ="text-3xl text-secondary-200 font-psemibold my-8   text-center">
            Your Test History
          </Text>

          {historyData.length > 0 ? (
          historyData.map((data) => (
            <ListItem key={data.id} data={data} />
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>
              No test history found for this vehicle number.
            </Text>
          </View>
        )}

        </View>

        

      </ScrollView>
    </SafeAreaView>
  )
}

export default history