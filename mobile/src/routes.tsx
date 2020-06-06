import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Detail from './pages/Detail';
import Home from './pages/Home';
import Points from './pages/Points';

const AppStack = createStackNavigator();

const Routes = () => (
  <NavigationContainer>
    <AppStack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: '#f0f0f5',
        },
      }}
    >
      <AppStack.Screen component={Home} name="Home" />
      <AppStack.Screen component={Detail} name="Detail" />
      <AppStack.Screen component={Points} name="Points" />
    </AppStack.Navigator>
  </NavigationContainer>
);

export default Routes;
