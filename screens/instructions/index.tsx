import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Image, Text, TouchableOpacity, View, Wizard } from 'react-native-ui-lib';
import { global } from '../../style';
// import Toast from 'react-native-simple-toast';

const Instructions = () => {
  const navigation = useNavigation<any>();

  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);

  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <View style={global.field}>
        <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToPrevStep}>
          <Text style={[global.btnText, global.white]}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const goToNextStep = () => {
    const prevActiveIndex = active;
    const prevCompletedStepIndex = completedStep;
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

  const Next = () => {
    return (
      <View style={global.field}>
        <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToNextStep}>
          <Text style={[global.btnText, global.white]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Register = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <View style={[global.field, global.center]}>
          <Image source={require("../../assets/onboarding/register.png")} width={300} height={300}></Image>
        </View>

        <View style={global.field}>
					<Text title>Register</Text>
					<Text subtitle>Email *</Text>
        </View>

				<View flexG />

        <View style={global.field}>
          {Next()}
        </View>
      </View>
    )
  }

  const Display = () => {
    return (
			<View style={[global.container, global.spaceEvenly]}>
        <View style={[global.field, global.center]}>
          <Image source={require("../../assets/onboarding/farmer.png")} width={300} height={300}></Image>
        </View>

        <View style={global.field}>
					<Text title>Register</Text>
					<Text subtitle>Email *</Text>
        </View>

				<View flexG />
        
        <View style={global.field}>
					{Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const PreOrder = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <View style={[global.field, global.center]}>
          <Image source={require("../../assets/onboarding/order.png")} width={300} height={300}></Image>
        </View>

        <View style={global.field}>
					<Text title>Register</Text>
					<Text subtitle>Email *</Text>
        </View>

				<View flexG />
        
        <View style={global.field}>
					{Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const Notify = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <View style={[global.field, global.center]}>
          <Image source={require("../../assets/onboarding/information.png")} width={300} height={300} style={{ textAlign: "center", justifyContent: "center", alignItems: "center"}}></Image>
        </View>

        <View style={global.field}>
					<Text title>Register</Text>
					<Text subtitle>Email *</Text>
        </View>

				<View flexG />
        
        <View style={global.field}>
					{Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const Accept = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <View style={[global.field, global.center]}>
          <Image source={require("../../assets/onboarding/market.png")} width={300} height={300}></Image>
        </View>

        <View style={global.field}>
					<Text title>Register</Text>
					<Text subtitle>Email *</Text>
        </View>

				<View flexG />
        
        <View style={global.field}>
					{Prev()}
        </View>
      </View>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return Register();
      case 1:
        return Display();
      case 2:
        return PreOrder();
      case 3:
        return Notify();
      case 4:
        return Accept();
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
          <View style={global.flex}>
						<Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
							<Wizard.Step state={getStepState(0)} label={'Register'} />
							<Wizard.Step state={getStepState(1)} label={'Display'} />
							<Wizard.Step state={getStepState(2)} label={'Pre-order'} />
							<Wizard.Step state={getStepState(3)} label={'Notify'} />
							<Wizard.Step state={getStepState(4)} label={'Accept'} />
						</Wizard>
            {Current()}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Instructions