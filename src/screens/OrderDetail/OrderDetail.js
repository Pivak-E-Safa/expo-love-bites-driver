import React, { useContext, useEffect } from 'react'
import { ScrollView, Dimensions } from 'react-native'
import Spinner from '../../components/Spinner/Spinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import TextError from '../../components/Text/TextError/TextError'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
// import Analytics from '../../utils/analytics'
import Status from '../../components/OrderDetail/Status/Status'
import Detail from '../../components/OrderDetail/Detail/Detail'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import CustomerMarker from '../../assets/SVG/customer-marker'
import TrackingRider from '../../components/OrderDetail/TrackingRider/TrackingRider'
import OrdersContext from '../../context/Orders'
import { mapStyle } from '../../utils/mapStyle'

const { height: HEIGHT } = Dimensions.get('screen')

function OrderDetail(props) {
  const routeId = props.route.params ? props.route.params.id : null
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  // useEffect(() => {
  //   async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
  //       orderId: routeId
  //     })
  //   }
  //   Track()
  // }, [])

  const order = orders.find(o => o.id === routeId)

  if (loadingOrders || !order) return <Spinner />
  if (errorOrders) return <TextError text={JSON.stringify(errorOrders)} />

  const {
    id,
    restaurant,
    deliveryAddress,
    items,
    taxationAmount,
    total,
  } = order
  const subTotal = total - taxationAmount - (restaurant?.deliveryCharges ?? 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeContext.headerBackground }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: themeContext.headerBackground }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <MapView
          style={{ height: HEIGHT * 0.75 }}
          showsUserLocation={false}
          initialRegion={{
            latitude: deliveryAddress?.location.latitude,
            longitude: deliveryAddress?.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
          rotateEnabled={false}
          customMapStyle={themeContext.ThemeValue === 'Dark' ? mapStyle : null}
          provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              latitude: restaurant?.location.latitude,
              longitude: restaurant?.location.longitude,
            }}>
            <RestaurantMarker />
          </Marker>
          <Marker
            coordinate={{
              latitude: deliveryAddress?.location.latitude,
              longitude: deliveryAddress?.location.longitude
            }}>
            <CustomerMarker />
          </Marker>
          {order.rider && <TrackingRider routeId={order.rider.id} />}
        </MapView>
        <Status
          orderStatus={order.orderStatus}
          createdAt={order.createdAt}
          acceptedAt={order.acceptedAt}
          pickedAt={order.pickedAt}
          deliveredAt={order.deliveredAt}
          cancelledAt={order.cancelledAt}
          assignedAt={order.assignedAt}
          theme={currentTheme}
        />
        <Detail
          navigation={props.navigation}
          currencySymbol={configuration.currencySymbol}
          items={items}
          from={restaurant?.name}
          orderNo={order.id}
          deliveryAddress={deliveryAddress?.deliveryAddress}
          subTotal={subTotal}
          tax={taxationAmount}
          deliveryCharges={(restaurant?.deliveryCharges ?? 0)}
          total={total}
          theme={currentTheme}
          routeId={id}
          rider={order.rider}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetail
