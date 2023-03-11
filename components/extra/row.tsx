import React from "react"
import { View } from "react-native"
import { global } from "../../style"

const Row = ({ children }) => {
  return (
    <View style={global.row}>
      {children}
    </View>
  )
}

export default Row