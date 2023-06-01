import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { global } from '../../style';
// import Toast from 'react-native-simple-toast';

const Instructions = () => {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <Button style={active !== 0 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-left"} size={48} color={Colors.white} />} onPress={goToPrevStep} disabled={active === 0} />
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
      <View>
        {active !== 4
          ? <Button style={active !== 4 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active == 4} />
          : <Button style={{backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"check"} size={48} color={Colors.white} />} onPress={() => navigation.navigate("Dashboard")} />
        }
      </View>
    );
  };

  const Buttons = () => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          <Text>{active}</Text>
          {Next()}
        </View>
      </View>
    )
  }

  const Search = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../assets/onboarding/search.jpg")} />
        </View>
        <View flex style={[global.container, global.bgWhite]}>
          <Text subtitle>Searching for fresh produce</Text>
          <Text h3>Search for a farmer near you and pick out fresh produce that you would like to purchase</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    )
  }

  const Request = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../assets/onboarding/request.jpg")} />
        </View>
        <View flex style={[global.container, global.bgWhite]}>
          <Text subtitle>Request a meeting</Text>
          <Text h3>Request a meeting to the farmer with your order at their available time options that they have to be able to purchase your order.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Decide = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../assets/onboarding/decide.jpg")} />
        </View>
        <View flex style={[global.container, global.bgWhite]}>
          <Text subtitle>Decide on your requests</Text>
          <Text h3>Farmers would need to decide on if they would accept or decline your meeting request.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Meet = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../assets/onboarding/meet.jpg")} />
        </View>
        <View flex style={[global.container, global.bgWhite]}>
          <Text subtitle>Meet up</Text>
          <Text h3>If the request has been confirmed, the consumer would meet at the farmer's location to purchase their order of fresh produce.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Enjoy = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../assets/onboarding/enjoy.jpg")} />
        </View>
        <View flex style={[global.container, global.bgWhite]}>
          <Text subtitle>Enjoy!</Text>
          <Text h3>Enjoy your fresh produce!</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return Search();
      case 1:
        return Request();
      case 2:
        return Decide();
      case 3:
        return Meet();
      case 4:
        return Enjoy();
    }
  };

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <View style={global.flex}>
            {Current()}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Instructions