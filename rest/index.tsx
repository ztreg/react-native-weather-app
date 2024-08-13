// import { Image, StyleSheet } from 'react-native';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { useEffect, useState } from 'react';
// import Dropdown from '@/components/Dropdown';
// import cities from 'cities.json';
// import { useDay } from '@/contexts/day-context';
// import React from 'react';

// export default function HomeScreen() {
//   const [data, setData] = useState<any>(null)
//   const [currentDay, setCurrentDay] = useState<any>(null)
//   const [restOfDay, setRestOfDay] = useState<any[] | null>(null)
//   const [defaultLocation, setDefaultLocation] = useState<any | null>(null)
//   const { day, setDay } = useDay();

//   const [selectedOption, setSelectedOption] = useState("");
//   const typedOptions = cities as any[]
//   const options = typedOptions.sort((a, b) => a.name.localeCompare(b.name)).map((city: any) => city.name)
//   const handleOptionSelected = (option: any) => {
//     setSelectedOption(option);
//     fetchWeather(option)
//   };

//   const fetchWeather = async (searchValue?: string) => {
//     try {
//       const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${searchValue}&days=7&alerts=no&aqi=no&key=c08645764b994410956135425243007`)
//       const json = await res.json()

//       const allTimes = json?.forecast?.forecastday?.[0].hour
//       const currentTime = json.current?.last_updated_epoch
//       const timesOfInterest = allTimes.filter((time: any) => time.time_epoch > currentTime)
//       setRestOfDay(timesOfInterest)
//       setData(json)
//       return res
//     } catch (error) {
//       return error
//     }
//   }

//   function renderData() {
//     if (data && restOfDay && restOfDay?.length > 0 ) {
//       return <>
//       <ThemedView>
//       <ThemedText style={styles.stepContainer}> 
//         { getTime(data?.current?.last_updated) }
//         <ThemedText> {data?.current?.temp_c } °</ThemedText>
//         <Image
//           source={{uri: data?.current?.condition?.icon}}
//           style={styles.weatherIcon}
//         />
//       </ThemedText>
//     </ThemedView>
//       {restOfDay.map((day) => (
//         <ThemedView key={day.time}>
//         <ThemedText style={styles.stepContainer}>
//         { getTime(day?.time) }
//         <ThemedText> {day?.temp_c } °</ThemedText>
//         <Image
//           source={{uri: day?.condition?.icon}}
//           style={styles.weatherIcon}
//         />
//         </ThemedText>
//       </ThemedView>
//       ))}
//     </>
//     }
//     return 'loading';
//   }


//   useEffect(() => {
//     if (!data) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(success, error);
//       } else {
//         // alert("Geolocation not supported");
//       }
      
//       function success(position: any) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const text = `${latitude},${longitude}`
        
//         fetchWeather(text)
//         .catch((e) => console.error('Failed to fetch weather'));
//       }
      
//       function error() {
//         console.log("Unable to retrieve your location");
//       }
//     }
//     if (day?.day) {
//       setCurrentDay(day.day)
//       if (day.day !== currentDay) {
//         if (!data) {
//           fetchWeather(selectedOption)
//         } else {
//           setRestOfDay([])
//           const selectedDay = data?.forecast?.forecastday?.find((dayDate: any) => dayDate.date === day?.day)
//           const allTimes = selectedDay.hour
//           const currentTime = data.current?.last_updated.split(' ')?.[1]
//           const timesOfInterest = allTimes.filter((time: any) => time.time.split(' ')?.[1] > currentTime)
//           setRestOfDay(timesOfInterest)
//         }
//       }
//     }
//   }, [currentDay, data, selectedOption, day])

//   const getTime = (date: string) => {
//     return date.split(' ')?.[1] || date
//   }

//   const weatherType = 'sunny'
//   const image = weatherType === 'sunny' ? 'sunny.jpg' : 'rain.jpg'
  
//   return (
//    <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require(`@/assets/images/${image}`)}
//           style={styles.reactLogo}
//         />
//       }>
//        <Dropdown
//         options={options}
//         onOptionSelected={handleOptionSelected}
//         defaultLocation={defaultLocation}
//         placeholder={"Search.."}
//       />
//       {renderData() || <h1>Loading...</h1> }


//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   stepContainer: {
//     borderBottomWidth: 0.2,
//     borderBottomColor: 'red',
//     gap: 8,
//     paddingBottom: 8,
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   reactLogo: {
//     height: '100%',
//     width: '100%',
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
//   weatherIcon: {
//     width: 32,
//     height: 32
//   }
// });
