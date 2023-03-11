import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { LoaderScreen, RadioButton, RadioGroup, Text, Toast, TouchableOpacity, View, Wizard } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import CartRow from '../../components/cart/cart-row';
import { clearOrder, getOrderFarmer, getOrderUser, selectOrderItems, selectOrderTotal } from '../../features/order-slice';
import { db } from '../../firebase';
import { global } from '../../style';

const Cart = () => {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [chat, setChat] = useState<any>(null);
  const [chats, setChats] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const items = useSelector(selectOrderItems);
  const orderFarmer = useSelector(getOrderFarmer);
  const orderTotal = useSelector(selectOrderTotal);
  const orderUser = useSelector(getOrderUser);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

  const groupedItems = useMemo(() => {
    return items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
  }, [items]);

  const result = items.reduce(function(acc, curr) {
    // Check if there exist an object in empty array whose CategoryId matches
    let isElemExist = acc.findIndex(function(item) {
      return item.id === curr.id;
    });

    if (isElemExist === -1) {
      let obj: any = {};
      obj.id = curr.id;
      obj.count = 1;
      obj.description = curr.description;
      obj.farmer = curr.farmer;
      obj.image = curr.image;
      obj.price = curr.price;
      obj.title = curr.title;
      obj.quantity = curr.quantity;
      acc.push(obj)
    } else {
      acc[isElemExist].count += 1
    }

    return acc;
  }, []);

  const createOrder = async () => {
    await addDoc(collection(db, "Orders"), {
      consumer: orderUser,
      farmer: orderFarmer,
      listings: result,
      total: Number(orderTotal.toFixed(2)),
      status: "PENDING",
      createdAt: new Date(),
    })
      .then(async (doc) => {
        Toast.show("Order has been confirmed!", {
          duration: Toast.durations.SHORT,
          backgroundColor: "green",
          position: Platform.OS == "web" ? 650 : 700,
        });

        console.log("Setting order...");

        setOrder(doc.id);
      })
      .catch((e) => alert(e.message));
  }

  const handleChat = (async () => {
    let message = `${orderUser.name} has recently created an order (ID: ${order}) of (List of items here) for $${data.total.toFixed(2)}.`;

    if (chat.length != 0) {
      clearOrderItems();
      navigation.navigate("Conversation", { id: chat[0]?.id, message: message });
      return
    }

    await addDoc(collection(db, "Chats"), {
      consumer: orderUser,
      farmer: orderFarmer,
      messages: []
    })
    .then((doc) => {
      clearOrderItems();
      navigation.navigate("Conversation", { id: doc.id, message: message });
    })
    .catch(e => alert(e.message));
  });

  const toggleDialog = () => {
    setVisible(false);
  }

  // Get the user"s chats first
  useEffect(() => {
    if (orderUser && orderFarmer) {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", orderUser.id), where("farmer", "==", orderFarmer.id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      setLoading(false); 
    }
  }, [orderUser, orderFarmer]);

  useEffect(() => {
    if (chat) {
      setLoading(false); 
      return
    }
  }, [chat]);

  // Once order has been set, use the id to get the order"s data
  useEffect(() => {
    if (order) {
      console.log("Getting data...");

      getDoc(doc(db, "Orders", order)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setData(data);
      });
    }
  }, [order]);

  useEffect(() => {
    if (data) {
      console.log("Handling chat...");
      handleChat();
    }
  }, [data]);

  useEffect(() => {
    if (isPressed) {
      console.log(isPressed);
    }
  }, [isPressed]);

  if (loading) {
    return (
      <LoaderScreen />
    )
  }

  if (items.length == 0) {
    return (
      <View useSafeArea flex style={[global.container, global.center, global.bgGray]}>
        <Text style={global.subtitle}>Cart is empty</Text>
      </View>
    )
  }



  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  // const closeToast = () => {
  //   setTimeout(() => {
  //     setToast(undefined);
  //   }, 2000);
  // };

  const reset = () => {
    // setToast(`${name}, you bought some ${flavor.toLowerCase()}`)
    // closeToast();

    setActive(0);
    setCompletedStep(undefined);
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
      <View style={global.field}>
        <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToNextStep}>
          <Text style={[global.btnText, global.white]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ReviewOrder = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <Text title>Personal Information</Text>
        
        <View style={global.field}>
          {Next()}
        </View>
      </View>
    )
  }

  const ChooseOrderOption = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <Text title>Profile Images</Text>

        <RadioGroup>
          <RadioButton value={'Delivery'} label={'Delivery'}/>
          <RadioButton value={'Pick Up'} label={'Pick Up'}/>
        </RadioGroup>

        <View style={global.field}>
          {Next()}
        </View>
      </View>
    );
  };

  const Checkout = () => {
    return (
      // <View style={[global.container, global.spaceEvenly]}>

      //   <Image
      //     style={{ width: "auto", height: 100 }}
      //     source={require("../../assets/logo.png")}
      //     resizeMode="contain"
      //   />

      //   <View>
      //     <Text title>Register</Text>
      //     <FirebaseRecaptchaVerifierModal
      //       ref={recaptchaVerifier}
      //       firebaseConfig={app.options}
      //       attemptInvisibleVerification={attemptInvisibleVerification}
      //     />
      //   </View>
        
      //   <View style={global.field}>
      //     <Text subtitle>Phone Number</Text>
      //     <PhoneInput
      //       ref={phoneRef}
      //       initialCountry={'us'}
      //       style={global.input}
      //       onChangePhoneNumber={(phone) => {
      //         setPhone(phone);
      //         console.log(phone);
      //       }}
      //       textProps={{
      //         placeholder: 'Enter a phone number...'
      //       }}
      //     />
      //   </View>

      //   <View style={global.field}>
      //     <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={verifyPhone}>
      //       <Text style={[global.btnText, global.white]}>Send Verification Code</Text>
      //     </TouchableOpacity>
      //   </View>
        
      //   <View style={global.field}>
      //     <Text subtitle>Verify SMS Code</Text>
      //     <OTPInputView
      //       style={{width: '100%', height: 50}}
      //       pinCount={6}
      //       code={sms}
      //       onCodeChanged={code => setSMS(code)}
      //       autoFocusOnLoad={false}
      //       codeInputFieldStyle={global.otpInput}
      //       codeInputHighlightStyle={styles.underlineStyleHighLighted}
      //       // onCodeFilled={code => onSubmit(code)}
      //     />
      //   </View>          
        
      //   <View style={global.field}>
      //     {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      //     {Prev()}
      //   </View>
      // </View>
      <ScrollView style={[global.container, global.bgGray]} contentContainerStyle={global.spaceEvenly} showsVerticalScrollIndicator={Platform.OS == "web"}>

        <View style={global.field}>
          <Text style={global.subtitle}>Farmer</Text>
          <Text>{(items[0]?.farmer.business)}</Text>
        </View>
        <View style={global.field}>
          <Text style={global.subtitle}>Address</Text>
          <Text>{items[0]?.farmer.address}</Text>
        </View>
        <View style={global.field}>
          <Text style={global.subtitle}>Options</Text>
        </View>
        
        <Text style={global.subtitle}>Your Items</Text>

        {Object.entries(groupedItems).map(([key, items]: any) => (
          <CartRow
            key={key}
            id={items[0]?.id}
            title={items[0]?.title}
            description={items[0]?.description}
            price={items[0]?.price}
            image={items[0]?.image}
            quantity={items[0]?.quantity}
            count={items.length}
            farmer={items[0]?.farmer}
          />
        ))}

        <View flexG />

        <View style={global.field}>
          {Next()}
        </View>
      </ScrollView>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return ReviewOrder();
      case 1:
        return ChooseOrderOption();
      case 2:
        return Checkout();
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
              <Wizard.Step state={getStepState(0)} label={'Review Order'} />
              <Wizard.Step state={getStepState(1)} label={'Choose Order Option'} />
              <Wizard.Step state={getStepState(2)} label={'Checkout'} />
            </Wizard>
            {Current()}
          </ScrollView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* {!_.isNil(toast) && <Toast testID={'uilib.toast'} visible position="bottom" message={toast} />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1
  },
  allTypes: {
    justifyContent: 'space-between'
  },
  stepContainer: {
    flex: 1,
    // justifyContent: 'space-between',
    margin: 24
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default Cart