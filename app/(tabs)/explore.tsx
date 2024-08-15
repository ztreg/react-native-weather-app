import { StyleSheet, Image, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import * as cities from '../../data/geonames-all-cities-with-a-population-1000.json'
import { useDay } from '@/@contexts/day-context';
import { router } from 'expo-router';
import React from 'react';
import Dropdown from '@/components/Dropdown';
import * as Location from 'expo-location';

export default function TabTwoScreen() {
  const [data, setData] = useState<any>(null);
  const [defaultLocation, setDefaultLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { day, setDay } = useDay();
  const [selectedOption, setSelectedOption] = useState("");
  const [typedOptions, setTypedOptions] = useState<any[] | null>(null);

  const test = {
    geoname_id: "726174",
    name: "Targovishte",
    ascii_name: "Targovishte",
    alternate_names: [
      "Eski Cuma",
      "Eski Djoumaia",
      "Eski Djouma\u00efa",
      "Eski Dschumaja",
      "Eski Dzhumaya",
      "Eski Dzuma",
      "Eski Dzumaja",
      "Eski Dzumaya",
      "Eski D\u017euma",
      "Eski D\u017eumaja",
      "TGV",
      "Targovichte",
      "Targovicht\u00e9",
      "Targovishte",
      "Targovisjte",
      "Targoviste",
      "Targovixte",
      "Targovi\u015dte",
      "Targowischte",
      "Targ\u00f2vixte",
      "Tarnkoviste",
      "Tergovishce",
      "Tergoviste",
      "Tergovi\u0161t\u0117",
      "Tirgovishte",
      "Trgovishte",
      "Trgoviste",
      "Trgovi\u0161te",
      "Turgovishhe",
      "Turgovishte",
      "Turgoviste",
      "Tyrgovishte",
      "Tyrgowiszte",
      "T\u00ebrgovish\u00e7e",
      "T\u0103rgovi\u0161te",
      "T\u0103rgovi\u0219te",
      "T\u0103rgowischte",
      "T\u016drgovishte",
      "T\u016drgovi\u0161te",
      "T\u01cergovi\u0161te",
      "targhwfyshth",
      "te er ge wei shen te",
      "teoleugobisyute",
      "trgwbysth",
      "\u03a4\u03b1\u03c1\u03b3\u03ba\u03cc\u03b2\u03b9\u03c3\u03c4\u03b5",
      "\u0422\u0438\u0440\u0433\u043e\u0432\u0438\u0448\u0442\u0435",
      "\u0422\u0440\u0433\u043e\u0432\u0438\u0448\u0442\u0435",
      "\u0422\u044a\u0440\u0433\u043e\u0432\u0438\u0449\u0435",
      "\u0422\u044b\u0440\u0433\u043e\u0432\u0438\u0448\u0442\u0435",
      "\u05d8\u05e8\u05d2\u05d5\u05d1\u05d9\u05e9\u05d8\u05d4",
      "\u062a\u0627\u0631\u063a\u0648\u0641\u064a\u0634\u062a\u0647",
      "\u062a\u0631\u06af\u0648\u0648\u06cc\u0634\u062a\u06d2",
      "\u062a\u0631\u06af\u0648\u0648\u06cc\u0634\u062a\u06d2 \u060c\u0628\u0644\u063a\u0627\u0631\u06cc\u06c1",
      "\u7279\u723e\u6208\u7dad\u4ec0\u7279",
      "\ud130\ub974\uace0\ube44\uc288\ud14c",
    ],
    feature_class: "P",
    feature_code: "PPLA",
    country_code: "BG",
    cou_name_en: "Bulgaria",
    country_code_2: null,
    admin1_code: "60",
    admin2_code: "TGV35",
    admin3_code: null,
    admin4_code: null,
    population: 34793,
    elevation: null,
    dem: 186,
    timezone: "Europe/Sofia",
    modification_date: "2022-08-22",
    label_en: "Bulgaria",
    coordinates: { lon: 26.57215, lat: 43.2512 },
  };

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
    console.log(cities);
    
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
        options={typedOptions}
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