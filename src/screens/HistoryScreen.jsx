import {View, Text, SafeAreaView, FlatList} from 'react-native';
import React from 'react';

const HistoryScreen = () => {
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
          padding: 20,
        }}>
        <FlatList
          data={data}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  backgroundColor: '#ffffff',
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
                      color: '#000000',
                      fontWeight: '500',
                    }}>
                    {item.timerName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 21,
                      color: 'green',
                    }}>
                    {item.category}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    color: '#000000',
                  }}>
                  Completed at: {item?.completionTime}
                </Text>
              </View>
            );
          }}
          // keyExtractor={({item}) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
