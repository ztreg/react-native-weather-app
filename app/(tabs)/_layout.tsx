import { Tabs } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useChoosenLocation, useCities, useDay, useWeather } from '@/@contexts/day-context';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setCities } = useCities();
  const [data, setData] = useState<any>(null)
  const [currentDay, setCurrentDay] = useState<any>(null)
  const [restOfDay, setRestOfDay] = useState<any[] | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { choosenLocation, setChoosenLocation } = useChoosenLocation();
  const { day, setDay } = useDay();
  const { weather, setWeather } = useWeather()

  const fetchWeather = useCallback(async (searchValue = "Stockholm") => {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c08645764b994410956135425243007&q=${searchValue}&days=7&aqi=no&alerts=no`);
    const jsonData = await response.json();
    setWeather({data: jsonData})
    if (choosenLocation?.loc !== jsonData?.location?.name) {
      setChoosenLocation({loc: jsonData?.location?.name})
    }
  }, [choosenLocation, setChoosenLocation, setWeather])

  useEffect(() => {
    const towns = ['Stockholm', 'Berlin', 'Oslo', 'Solna', 'Paris', 'Rome']
    setCities(towns)
    if (!weather?.data) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        const text = `${latitude},${longitude}` 

        fetchWeather(text)
        .catch(console.error);
      })();
    }
    if (day?.day) {
      setCurrentDay(day.day)
      if (day.day !== currentDay) {
        if (!data) {
          fetchWeather(selectedOption)
        } else {
          setRestOfDay([])
          const selectedDay = data?.forecast?.forecastday?.find((dayDate: any) => dayDate.date === day?.day)
          const allTimes = selectedDay.hour
          const currentTime = data.current?.last_updated.split(' ')?.[1]
          const timesOfInterest = allTimes.filter((time: any) => time.time.split(' ')?.[1] > currentTime)
          setRestOfDay(timesOfInterest)
        }
      }

    }
  }, [setCities])

  function renderApplication() {
    if (weather?.data?.length > 0) {
      return <>
        <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Day',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'today' : 'today-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Week',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
              ),
            }}
          />
        </Tabs>
      </>
    }
    return ''
  }
  
  return (
    renderApplication() || <ThemedText>Loading...</ThemedText>
  );
}
