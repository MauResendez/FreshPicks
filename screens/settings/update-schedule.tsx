import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { DateTimePicker, Switch, Text, View } from 'react-native-ui-lib';
import { global } from '../../style';

const UpdateSchedule = () => {
  const [monday, setMonday] = useState<any>({ enable: false, start: null, end: null });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: null, end: null });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: null, end: null });
  const [thursday, setThursday] = useState<any>({ enable: false, start: null, end: null });
  const [friday, setFriday] = useState<any>({ enable: false, start: null, end: null });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: null, end: null });
  const [sunday, setSunday] = useState<any>({ enable: false, start: null, end: null });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={global.container}>
          <Text title>Farmer Schedule</Text>

          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Monday</Text>
              <Switch value={monday.enable} onValueChange={() => setMonday({...monday, enable: !monday.enable})} />
            </View>

            {monday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Tuesday</Text>
              <Switch value={tuesday.enable} onValueChange={() => setTuesday({...tuesday, enable: !tuesday.enable})} />
            </View>

            {tuesday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Wednesday</Text>
              <Switch value={wednesday.enable} onValueChange={() => setWednesday({...wednesday, enable: !wednesday.enable})} />
            </View>

            {wednesday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Thursday</Text>
              <Switch value={thursday.enable} onValueChange={() => setThursday({...thursday, enable: !thursday.enable})} />
            </View>

            {thursday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Friday</Text>
              <Switch value={friday.enable} onValueChange={() => setFriday({...friday, enable: !friday.enable})} />
            </View>

            {friday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Saturday</Text>
              <Switch value={saturday.enable} onValueChange={() => setSaturday({...saturday, enable: !saturday.enable})} />
            </View>

            {saturday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>
          <View style={global.field}>
            <View style={[global.row, global.spaceBetween]}>
              <Text subtitle>Sunday</Text>
              <Switch value={sunday.enable} onValueChange={() => setSunday({...sunday, enable: !sunday.enable})} />
            </View>

            {sunday.enable && <View style={[global.row, global.spaceBetween]}>
              <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
              <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
            </View>}
          </View>

          <View flexG />

          <View style={global.field}>
            <TouchableOpacity style={[global.btn, global.bgOrange]}>
              <Text style={[global.btnText, global.white]}>Update Farmer Schedule</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default UpdateSchedule