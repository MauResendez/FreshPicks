// import React from "react"
// import { Platform, ScrollView } from "react-native"
// import { Text, View } from "react-native-ui-lib"
// import { global } from "../../style"

// const Order = () => {
//   return (
//     <ScrollView style={[global.container, global.bgGray]} contentContainerStyle={global.spaceEvenly} showsVerticalScrollIndicator={Platform.OS == "web"}>

//       <View style={global.field}>
//         <Text style={global.subtitle}>Farmer</Text>
//         <Text>{(items[0]?.farmer.business)}</Text>
//       </View>
//       <View style={global.field}>
//         <Text style={global.subtitle}>Address</Text>
//         <Text>{items[0]?.farmer.address}</Text>
//       </View>
//       <View style={global.field}>
//         <Text style={global.subtitle}>Options</Text>
//       </View>
      
//       <Text style={global.subtitle}>Your Items</Text>

//       {/* {Object.entries(groupedItems).map(([key, items]: any) => (
//         <CartRow
//           key={key}
//           id={items[0]?.id}
//           title={items[0]?.title}
//           description={items[0]?.description}
//           price={items[0]?.price}
//           image={items[0]?.image}
//           quantity={items[0]?.quantity}
//           count={items.length}
//           farmer={items[0]?.farmer}
//         />
//       ))} */}

//       <View flexG />

//       {/* <View style={global.field}>
//         {Next()}
//       </View> */}
//     </ScrollView>
//   )
// }

// export default Order

import React from 'react'
import { Text, View } from 'react-native-ui-lib'

const Order = () => {
	return (
		<View>
			<Text>Order</Text>
		</View>
	)
}

export default Order