import React, { useContext } from 'react'
import { View } from 'react-native'
import SideDrawerItems from '../Drawer/Items/DrawerItems'
import SideDrawerProfile from '../Drawer/Profile/DrawerProfile'
import i18n from '../../../i18n'
import { theme } from '../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserContext from '../../context/User'
import styles from './styles'
// import Analytics from '../../utils/analytics'
const datas = [
  {
    title: 'titleOrders',
    icon: 'layers',
    navigateTo: 'MyOrders',
    isAuth: true
  },
  {
    title: 'titleProfile',
    icon: 'user',
    navigateTo: 'Profile',
    isAuth: true
  },
  {
    title: 'myAddresses',
    icon: 'location-pin',
    navigateTo: 'Addresses',
    isAuth: true
  },
]

function SidebBar(props) {
  const inset = useSafeAreaInsets()
  const { isLoggedIn, logout } = useContext(UserContext)
  const currentTheme = theme['Dark']

  return (
    <View
      style={[
        styles().flex,
        {
          justifyContent: 'space-between',
          backgroundColor: currentTheme.themeBackground
        }
      ]}>
      <View style={{ flexGrow: 1 }}>
        <View style={styles(currentTheme).topContainer}>
          <SideDrawerProfile navigation={props.navigation} />
        </View>
        <View style={styles().botContainer}>
          {datas.map((dataItem, ind) => (
            <View key={ind} style={styles().item}>
              <SideDrawerItems
                onPress={async() => {
                  if (dataItem.isAuth && !isLoggedIn) {
                    props.navigation.navigate('SignIn')
                  } else {
                    props.navigation.navigate(dataItem.navigateTo)
                  }
                }}
                icon={dataItem.icon}
                title={i18n.t(dataItem.title)}
              />
            </View>
          ))}
          {isLoggedIn && (
            <View style={styles().item}>
              <SideDrawerItems
                onPress={async() => {
                  // await Analytics.track(Analytics.events.USER_LOGGED_OUT)
                  // await Analytics.identify(null, null)
                  logout();
                  props.navigation.closeDrawer();
                }}
                icon={'logout'}
                title={i18n.t('titleLogout')}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
export default SidebBar
