import React, { useCallback, useContext, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import navigationService from './navigationService'
import SideBar from '../components/Sidebar/Sidebar'
import Main from '../screens/Main/Main'
import RestaurantDetails from '../screens/RestaurantDetails/RestaurantDetails'
import { theme } from '../utils/themeColors'
import screenOptions from './screenOptions'
const NavigationStack = createStackNavigator()
const MainStack = createStackNavigator()
const SideDrawer = createDrawerNavigator()

function Drawer() {
  return (
    <SideDrawer.Navigator drawerContent={props => <SideBar {...props} />}>
      <SideDrawer.Screen
        options={{ headerShown: false }}
        name="NoDrawer"
        component={NoDrawer}
      />
    </SideDrawer.Navigator>
  )
}
function NoDrawer() {
  const currentTheme = theme['Dark']
  return (
    <NavigationStack.Navigator
      screenOptions={screenOptions({
        theme: 'Dark',
        headerMenuBackground: currentTheme.headerMenuBackground,
        backColor: currentTheme.headerBackground,
        lineColor: currentTheme.horizontalLine,
        textColor: currentTheme.headerText,
        iconColor: currentTheme.iconColorPink
      })}>
      <NavigationStack.Screen
        name="Main"
        component={Main}
        options={{ header: () => null }}
      />
      <NavigationStack.Screen
        name="RestaurantDetails"
        component={RestaurantDetails}
        options={{ header: () => null }}
      />
    </NavigationStack.Navigator>
  )
}


function AppContainer() {

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={ref => {
          navigationService.setGlobalRef(ref)
        }}>
        <MainStack.Navigator
          initialRouteName={'Drawer'}>
              <MainStack.Screen
                name="Drawer"
                component={Drawer}
                options={{ headerShown: false }}
              />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default AppContainer
