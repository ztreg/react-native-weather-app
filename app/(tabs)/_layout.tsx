import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as allCities from '../../data/geonames-all-cities-with-a-population-1000.json'
import { useCities } from '@/@contexts/day-context';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setCities } = useCities();

  useEffect(() => {
    setCities([allCities])
  }, [setCities])
  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tue',
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
  );
}
