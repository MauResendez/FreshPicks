import React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import { Button, TextField } from "react-native-ui-lib"
import { global } from "../../style"

const EditListing = () => {
  return (
    <ScrollView style={{ padding: 8 }}>
      <KeyboardAvoidingView style={[global.center]} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <View style={global.field}>
          <Text style={global.subtitle}>Post Title</Text>
          <TextField style={global.input} placeholder="Enter the listing title here" />
        </View>
        <View style={global.field}>
          <Text style={global.subtitle}>Post Description</Text>
          <TextField style={global.input} placeholder="Enter the listing description here" multiline />
        </View>
        <View style={global.field}>
          <Text style={global.subtitle}>Post Image</Text>
          <Button title="Produce Image" color="green" />
        </View>
        <View style={global.field}>
          <Button style={global.button} title="Submit" />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default EditListing