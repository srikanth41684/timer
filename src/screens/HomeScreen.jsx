import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Header} from '@react-navigation/elements';

const HomeScreen = () => {
  const navigation = useNavigation();
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => (prevProgress < 100 ? prevProgress + 10 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
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
        <Header
          headerLeft={() => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'lightgray',
                borderRadius: 50,
                marginLeft: 20,
                marginRight: 10,
              }}></View>
          )}
          title="Wellcome"
        />
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

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('createTimer');
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#3D4AEE',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 25,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
              +
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
