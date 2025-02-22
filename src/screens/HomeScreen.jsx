import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

const HomeScreen = () => {
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#EFF1FE',
        }}>
        <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <View>
                <View>
                  <Text>{item?.timerName}</Text>
                  <Text>Timer</Text>
                </View>
                <View></View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
