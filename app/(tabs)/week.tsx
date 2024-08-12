import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Button, TouchableHighlight, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import { REACT_APP_API_KEY } from '@env';
import { useState, useEffect } from 'react';
import Dropdown from '../../components/Dropdown';
import cities from 'cities.json';
import { useDay } from '@/contexts/day-context';
import { router } from 'expo-router';
// import { TouchableHighlight } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  const [data, setData] = useState<any>(null)
  const [defaultLocation, setDefaultLocation] = useState<any | null>(null)
  const { day, setDay } = useDay();
  const [selectedOption, setSelectedOption] = useState("");

  const typedOptions = cities as any[]
  const options = typedOptions.sort((a, b) => a.name.localeCompare(b.name)).map((city: any) => city.name)
  const handleOptionSelected = (option: any) => {
    setSelectedOption(option);
    fetchWeather(option)
  };

  const fetchWeather = async (searchValue = "Stockholm") => {
    const REACT_APP_API_KEY = process.env.EXPO_PUBLIC_API_KEY;
    alert(REACT_APP_API_KEY);
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c08645764b994410956135425243007&q=${searchValue}&days=7&aqi=no&alerts=no`)
      const json = await res.json()
      const allDays = json?.forecast?.forecastday.splice(1)
      setData(allDays)
      setDefaultLocation(json?.location?.name)
      return res
    } catch (error) {
      return error
    }
  }

  function changeDate(date: string) {
    setDay({day: date})
    router.navigate('/')
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
    
    function success(position: any) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const text = `${latitude},${longitude}` 
      fetchWeather(text)
      .catch(console.error);
    }
    
    function error() {
      console.log("Unable to retrieve your location");
    }
  }, [])

  const getTime = (date: string) => {
    return date.split(' ')?.[1] || date
  }

  const weatherType = 'sunny'
  const image = weatherType === 'sunny' ? 'sunny.jpg' : 'rain.jpg'
  return (
    defaultLocation && data && data?.length > 0 && <ParallaxScrollView
       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
       headerImage={
         <Image
           source={require(`@/assets/images/${image}`)}
           style={styles.reactLogo}
         />
       }>
       <Dropdown
        options={options}
        onOptionSelected={handleOptionSelected}
        defaultLocation={defaultLocation}
        placeholder={"Search.."}
      />
       {data.map((day: any) => (
         <ThemedView key={day.date}>
          <Pressable onPress={() => changeDate(day.date)}>
          <ThemedText style={styles.stepContainer}>{ getTime(day?.date) }
          <ThemedText> {day?.day?.avgtemp_c } °</ThemedText>
          <Image
            source={{uri: day?.day?.condition?.icon}}
            style={styles.weatherIcon}
          />
          </ThemedText>
          </Pressable>
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
    paddingBottom: 8,
    display: 'flex',
    justifyContent: 'space-between',
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
    height: 32
  }
});
