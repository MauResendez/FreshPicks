import React from "react"
import { View } from "react-native"
import { global } from "../../style"

const Column = ({ children }) => {
  return (
    <View style={global.column}>
      {children}
    </View>
  )
}

export default Column