import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('http://api.weatherapi.com/v1/current.json?key=c08645764b994410956135425243007&q=Stockholm&aqi=no')
    .then((response: any) => response.json())
    .then((json: any) => {
      setData(json)
      console.log(data);
      
      return json
    })
    .catch(error => {
      alert(error)
      console.error(error);
    });
  
  }, [])
  

  // let weather: any = null

  const weatherType = 'sunny'
  const image = weatherType === 'sunny' ? 'sunny.jpg' : 'rain.jpg'
  
  
  return (
   data && <ParallaxScrollView
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
        16:00
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        16:00
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        16:00 
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        16:00
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
        16:00 
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const getMoviesFromApi = () => {

};

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
  }
});
