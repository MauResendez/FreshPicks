import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { global } from '../../style'

const Inventory = () => {
  return (
    <View useSafeArea flex style={[global.container, global.bgGray]}>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={global.container}>
        <View style={global.field}>
          <Text subtitle>Listings Sold</Text>
          {/* <TextField style={global.input} value={email} onChangeText={(value) => setEmail(value)} autoComplete="email" placeholder="Enter your email address" migrate validate={'required'} /> */}
        </View>

        <View style={global.field}>
          <Text subtitle>Listings Pending</Text>
          {/* <TextField style={global.input} value={email} onChangeText={(value) => setEmail(value)} autoComplete="email" placeholder="Enter your email address" migrate validate={'required'} /> */}
        </View>

        <View style={global.field}>
          <Text subtitle>Listings Remaining</Text>
          {/* <TextField style={global.input} value={email} onChangeText={(value) => setEmail(value)} autoComplete="email" placeholder="Enter your email address" migrate validate={'required'} /> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Inventory