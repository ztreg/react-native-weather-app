import { useCities, useDay, useChoosenLocation, useWeather } from '@/@contexts/day-context';
import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/Dropdown';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null)
  const [restOfDay, setRestOfDay] = useState<any[] | null>(null)

  const { choosenLocation, setChoosenLocation } = useChoosenLocation();
  const { day } = useDay();
  const { cities } = useCities();
  const { weather } = useWeather()
  
  const handleOptionSelected = (option: any) => {
    setChoosenLocation({loc: option})
  };


  function renderData() {
    // if (cities && cities?.length > 0 && weather ) {
    //   return <>
    //   {restOfDay.map((day) => (
    //     <ThemedView key={day.time}>
    //       <ThemedText style={styles.stepContainer}>
    //       { getTime(day?.time) }
    //       <ThemedText style={[styles.space, styles.defaultWidth]}> {day?.temp_c } °</ThemedText>
    //       <Image
    //         source={{uri: 'https://' + day?.condition?.icon}}
    //         style={[styles.weatherIcon, styles.space]}
    //       /> 
    //       </ThemedText>
    //     </ThemedView>
    //   ))}
    // </>
    // }
    return null;
  }

  useEffect(() => {
    if (weather) {
      console.log(weather)
      const allTimes = weather?.forecast?.forecastday?.[0]?.hour
      const currentTime = weather.current?.last_updated_epoch
      const timesOfInterest = allTimes?.filter((time: any) => time.time_epoch > currentTime)
      setRestOfDay(timesOfInterest)
      setData(weather);
    }
  }, [weather])

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