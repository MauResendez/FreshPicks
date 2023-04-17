import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import _ from 'lodash';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native";
import { DateTimePicker, Switch, Text, TextField, Toast, TouchableOpacity, View, Wizard } from 'react-native-ui-lib';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const AddBusiness = () => {
  const navigation = useNavigation<any>();

  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [toast, setToast] = useState(undefined);
  const [business, setBusiness] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [website, setWebsite] = useState<any>(null);
  const [monday, setMonday] = useState<any>({ enable: false, start: null, end: null });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: null, end: null });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: null, end: null });
  const [thursday, setThursday] = useState<any>({ enable: false, start: null, end: null });
  const [friday, setFriday] = useState<any>({ enable: false, start: null, end: null });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: null, end: null });
  const [sunday, setSunday] = useState<any>({ enable: false, start: null, end: null });
  const [pickup, setPickUp] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [paypal, setPaypal] = useState<any>(null);
  const [cashapp, setCashapp] = useState<any>(null);
  const [venmo, setVenmo] = useState<any>(null);

  const onSubmit = async () => {
    try {
      await setDoc(doc(db, "Users", auth.currentUser.uid), {
        business: business,
        description: description,
        website: website,
        schedule: {
          monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday
        },
        payments: {
          paypal: paypal,
          cashapp: cashapp,
          venmo: venmo,
        },
        rating: 0,
        ratings: 0,
      });
    } catch (err: any) {
      Toast.show(`Error: ${err.message}`, {
        duration: Toast.durations.SHORT,
      });
    }
  };

  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  const closeToast = () => {
    setTimeout(() => {
      setToast(undefined);
    }, 2000);
  };

  const reset = () => {
    // setToast(`${name}, you bought some ${flavor.toLowerCase()}`)
    closeToast();

    setActive(0);
    setCompletedStep(undefined);
  };

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToPrevStep}>
        <Text style={[global.btnText, global.white]}>Back</Text>
      </TouchableOpacity>
    );
  };

  const goToNextStep = () => {
    const prevActiveIndex = active;
    const prevCompletedStepIndex = completedStep;
    const resetSteps = prevActiveIndex === 5;
    if (resetSteps) {
      reset();
      return;
    }

    const activeIndex = prevActiveIndex + 1;
    let completedStepIndex = prevCompletedStepIndex;
    if (!prevCompletedStepIndex || prevCompletedStepIndex < prevActiveIndex) {
      completedStepIndex = prevActiveIndex;
    }

    if (activeIndex !== prevActiveIndex || completedStepIndex !== prevCompletedStepIndex) {
      setActive(activeIndex);
      setCompletedStep(completedStepIndex);
    }
  };

  const Next = (disabled?: boolean) => {
    const label = active === 5 ? 'Done & Reset' : 'Next';

    return (
      <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToNextStep}>
        <Text style={[global.btnText, global.white]}>Next</Text>
      </TouchableOpacity>
    );
  };

  const FarmerInformation = () => {
    return (
      <View style={global.container}>
        <Text title>Farmer Information</Text>

        <View style={global.field}>
          <Text subtitle>Business Name *</Text>
          <TextField value={business} onChangeText={(value) => setBusiness(value)} style={global.input} placeholder="Enter your business" migrate validate={'required'} />
        </View>

        <View style={global.field}>
          <Text subtitle>Describe Your Business *</Text>
          <TextField value={description} onChangeText={(value) => setDescription(value)} style={global.textArea}  placeholder="Describe what products and services you sell" multiline maxLength={250} migrate validate={'required'} />
        </View>

        <View style={global.field}>
          <Text subtitle>Website</Text>
          <TextField value={website} onChangeText={(value) => setWebsite(value)} style={global.input} placeholder="Enter your website" migrate />
        </View>

        <View flexG />

        <View style={global.field}>
          {Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const FarmerSchedule = () => {
    return (
      <View style={global.container}>
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
          {Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const PaymentInformation = () => {
    return (
      <View style={global.container}>
        <Text title>Payment Information</Text>

        <View style={global.field}>
          <Text subtitle>PayPal</Text>
          <TextField value={paypal} onChangeText={(value) => setPaypal(value)} style={global.input} placeholder="Ex: example@gmail.com" migrate />
        </View>

        <View style={global.field}>
          <Text subtitle>CashApp</Text>
          <TextField value={cashapp} onChangeText={(value) => setCashapp(value)} style={global.input} placeholder="Ex: $example" migrate />
        </View>

        <View style={global.field}>
          <Text subtitle>Venmo</Text>
          <TextField value={venmo} onChangeText={(value) => setVenmo(value)} style={global.input} placeholder="Ex: @Example" migrate />
        </View>

        <View flexG />
        
        <View style={global.field}>
          {Prev()}
          
          <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
            <Text style={[global.btnText, global.white]}>Add Business</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return FarmerInformation();
      case 1:
        return FarmerSchedule();
      case 2:
        return PaymentInformation();
    }
  };

  const getStepState = (index: number) => {
    let state = Wizard.States.DISABLED;
    if (completedStep > index - 1) {
      state = Wizard.States.COMPLETED;
    } else if (active === index || completedStep === index - 1) {
      state = Wizard.States.ENABLED;
    }

    return state;
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={global.flex}>
            <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
              <Wizard.Step state={getStepState(0)} label={'Farmer Information'} />
              <Wizard.Step state={getStepState(1)} label={'Farmer Schedule'} />
              <Wizard.Step state={getStepState(2)} label={'Payment Information'} />
            </Wizard>
            {Current()}
          </ScrollView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {!_.isNil(toast) && <Toast testID={'uilib.toast'} visible position="bottom" message={toast} />}
    </View>
  );
}




export default AddBusiness