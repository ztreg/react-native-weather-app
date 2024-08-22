import { useCities, useDay, useChoosenLocation } from '@/@contexts/day-context';
import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useCallback, useEffect, useState } from 'react';
import Dropdown from '@/components/Dropdown';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null)
  const [currentDay, setCurrentDay] = useState<any>(null)
  const [restOfDay, setRestOfDay] = useState<any[] | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { choosenLocation, setChoosenLocation } = useChoosenLocation();
  const { day, setDay } = useDay();
  const { cities } = useCities();
  
  const [selectedOption, setSelectedOption] = useState("");
  const handleOptionSelected = (option: any) => {
    setSelectedOption(option);
    fetchWeather(option)
    setChoosenLocation({loc: option})
  };


  function renderData() {
    if (cities && cities?.length > 0 && data && restOfDay && restOfDay?.length > 0 && !errorMsg ) {
      return <>
      {restOfDay.map((day) => (
        <ThemedView key={day.time}>
          <ThemedText style={styles.stepContainer}>
          { getTime(day?.time) }
          <ThemedText style={[styles.space, styles.defaultWidth]}> {day?.temp_c } °</ThemedText>
          <Image
            source={{uri: 'https://' + day?.condition?.icon}}
            style={[styles.weatherIcon, styles.space]}
          /> 
          </ThemedText>
        </ThemedView>
      ))}
    </>
    }
    return null;
  }

  useEffect(() => {

  }, [])

  const getTime = (date: string) => {
    return date.split(' ')?.[1] || date
  }
  
  function getDayName(dateStr: any) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return days[d.getDay()];     
  }

  const weatherType = 'sunny'
  const image = weatherType === 'sunny' ? 'sunny.jpg' : 'rain.jpg'
  
  return (
   <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require(`@/assets/images/${image}`)}
          style={styles.reactLogo}
        />
      }>
      {choosenLocation?.loc && 
        <Dropdown
          options={cities}
          onOptionSelected={handleOptionSelected}
          defaultLocation={choosenLocation?.loc}
          placeholder={"Search.."}
        />
      }
      {day?.day &&  <ThemedView><ThemedText>{ getDayName(day?.day)} </ThemedText></ThemedView> }
      {errorMsg &&  <ThemedView><ThemedText>{ errorMsg } </ThemedText></ThemedView> }

      {renderData() || <ThemedView><ThemedText>Loading...</ThemedText></ThemedView>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: 'red',
    gap: 8,
    paddingBottom: 8
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  weatherIcon: {
    width: 32,
    height: 32,
    marginBottom: -8
  },
  space: {
    marginLeft: 54
  },
  defaultWidth: {
    width: 100
  }
});