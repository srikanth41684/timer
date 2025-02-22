import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AppThemeContext} from '../context/AppThemeContext';
import {Header} from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const {theme, setTheme} = useContext(AppThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const data = [
    {
      id: 1,
      timerName: 'Workout Timer',
      completionTime: '08:30 AM',
      category: 'Workout',
    },
    {
      id: 2,
      timerName: 'Workout Timer',
      completionTime: '08:30 AM',
      category: 'Workout',
    },
    {
      id: 3,
      timerName: 'Study Timer',
      completionTime: '08:30 AM',
      category: 'Study',
    },
    {
      id: 4,
      timerName: 'Break Timer',
      completionTime: '08:30 AM',
      category: 'Break',
    },
  ];

  const getHistoryHandler = async () => {
    const data = await AsyncStorage.getItem('history');
    let finalData = JSON.parse(data);
    console.log('finalData==========>', finalData);
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getHistoryHandler(); // Fetch updated timers from AsyncStorage
  };

  useEffect(() => {
    console.log('yes');

    getHistoryHandler();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Header
        headerStyle={{
          backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
        }}
        headerTitleStyle={{
          color: theme === 'dark' ? '#ffffff' : '#000000',
          paddingLeft: 20,
        }}
        title="History"
      />
      <View
        style={{
          flex: 1,
          backgroundColor: theme === 'dark' ? '#121212' : '#EFF1FE',
          padding: 20,
        }}>
        <FlatList
          data={data}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 10,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
                  borderRadius: 12,
                  padding: 15,
                  gap: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 23,
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                      fontWeight: '500',
                    }}>
                    {item.timerName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 21,
                      color: theme === 'dark' ? '#FFA24D' : 'green',
                    }}>
                    {item.category}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                  }}>
                  Completed at: {item?.completionTime}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
