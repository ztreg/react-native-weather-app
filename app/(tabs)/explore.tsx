import { StyleSheet, Image, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { useCities, useDay } from '@/@contexts/day-context';
import { router } from 'expo-router';
import Dropdown from '@/components/Dropdown';
import * as Location from 'expo-location';

export default function TabTwoScreen() {
  const [data, setData] = useState<any>(null);
  const [defaultLocation, setDefaultLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { day, setDay } = useDay();
  const [selectedOption, setSelectedOption] = useState("");
  const { cities } = useCities();

  // const options = typedOptions.sort((a, b) => a?.name?.localeCompare(b?.name))?.map((city: any) => city?.name)
  const handleOptionSelected = (option: any) => {
    setSelectedOption(option);
    fetchWeather(option);
  };

  const fetchWeather = async (searchValue = "Stockholm") => {
    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=c08645764b994410956135425243007&q=${searchValue}&days=7&aqi=no&alerts=no`
      );
      const json = await res.json();
      const allDays = json?.forecast?.forecastday;

      setData(allDays);
      setDefaultLocation(json?.location?.name);
      return res;
    } catch (error) {
      return error;
    }
  };

  function changeDate(date: string) {
    setDay({ day: date });
    router.navigate("/");
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const text = `${latitude},${longitude}`;

      setDefaultLocation(location);
      fetchWeather(text).catch(console.error);
    })();
  }, []);

  function renderData() {
    if (data) {
      return (
        <>
          {data.map((day: any) => (
            <ThemedView key={day.date}>
              <Pressable onPress={() => changeDate(day.date)}>
                <ThemedText style={styles.stepContainer}>
                  {getTime(day?.date)}
                  <ThemedText style={styles.space}>
                    {" "}
                    {day?.day?.avgtemp_c} °
                  </ThemedText>
                  <Image
                    source={{ uri: "https://" + day?.day?.condition?.icon }}
                    style={[styles.weatherIcon, styles.space]}
                  />
                </ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </>
      );
    }
    return null;
  }

  const getTime = (date: string) => {
    return date.split(" ")?.[1] || date;
  };

  const weatherType = "sunny";
  const image = weatherType === "sunny" ? "sunny.jpg" : "rain.jpg";
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require(`@/assets/images/${image}`)}
          style={styles.reactLogo}
        />
      }
    >
      <Dropdown
        options={cities}
        onOptionSelected={handleOptionSelected}
        defaultLocation={defaultLocation}
        placeholder={"Search.."}
      />
      {renderData() || (
        <ThemedView>
          <ThemedText>
            <h1>Loading...</h1>
          </ThemedText>
        </ThemedView>
      )}
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
  }
});