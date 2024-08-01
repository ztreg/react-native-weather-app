import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null)
  const [restOfDay, setRestOfDay] = useState<any[] | null>(null)


  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch('https://api.weatherapi.com/v1/forecast.json?q=Stockholm&days=1&alerts=no&aqi=no&key=c08645764b994410956135425243007')
      const json = await res.json()
      // console.log(json);
      
      const allTimes = json?.forecast?.forecastday?.[0].hour
      const currentTime = json.current?.last_updated_epoch
      const timesOfInterest = allTimes.filter((time: any) => time.time_epoch > currentTime)
      console.log(timesOfInterest);
      
      setRestOfDay(timesOfInterest)
      
      setData(json)
      return res
    }

    fetchWeather()
    .catch(console.error);
  }, [])

  const getTime = (date: string) => {
    return date.split(' ')?.[1] || date
  }

  const weatherType = 'sunny'
  const image = weatherType === 'sunny' ? 'sunny.jpg' : 'rain.jpg'
  
  return (
   data && restOfDay && restOfDay?.length > 0 && <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require(`@/assets/images/${image}`)}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        {data?.location?.name ?? ''} 
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        { getTime(data?.current?.last_updated) } | {data?.current?.temp_c } ° | 
        <Image
          source={data?.current?.condition?.icon}
          style={styles.weatherIcon}
        />
        {/* <img style=[styles.image] src={data?.current?.condition?.icon} /> */}
        </ThemedText>
      </ThemedView>
      {restOfDay.map((day) => (
        <ThemedView style={styles.stepContainer} key={day.time}>
          <ThemedText>
          { getTime(day?.time) } | {day?.temp_c } ° | <img src={data?.current?.condition?.icon} />
          </ThemedText>
        </ThemedView>
      ))}
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  stepContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: 'red',
    gap: 8,
    paddingBottom: 16,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  weatherIcon: {
    width: 24,
    height: 24
  }
});
