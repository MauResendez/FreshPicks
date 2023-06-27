import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePhone from "../../screens/auth/change-phone";
import Settings from "../../screens/settings";
import AccountInformation from "../../screens/settings/account-information";
import AddBusiness from "../../screens/settings/add-business";
import LinkAccount from "../../screens/settings/link-account";
import OrderHistory from "../../screens/settings/order-history";
import PrivacyPolicy from "../../screens/settings/privacy-policy";
import TermsAndConditions from "../../screens/settings/terms-and-conditions";
import VendorInformation from "../../screens/settings/vendor-information";
import VendorLocation from "../../screens/settings/vendor-location";
import VendorPreview from "../../screens/settings/vendor-preview";
import VendorSchedule from "../../screens/settings/vendor-schedule";

const Stack = createNativeStackNavigator();

const SettingStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Settings" 
      screenOptions={{
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Link Account" component={LinkAccount} />
      <Stack.Screen name="Account Information" component={AccountInformation} />
      <Stack.Screen name="Vendor Information" component={VendorInformation} />
      <Stack.Screen name="Vendor Location" component={VendorLocation} />
      <Stack.Screen name="Vendor Schedule" component={VendorSchedule} />
      <Stack.Screen name="Vendor Preview" component={VendorPreview} />
      <Stack.Screen name="Order History" component={OrderHistory} />
      <Stack.Screen name="Terms and Conditions" component={TermsAndConditions} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicy} />
    </Stack.Navigator>
  )
}

export default SettingStack