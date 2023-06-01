import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Picker, TabController, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const data = [ {value:50}, {value:80}, {value:90}, {value:70} ];
  const layout = useWindowDimensions();
  const width = layout.width/3;

  const FirstRoute = () => (
    <View useSafeArea flex>
      <View flex style={global.container}>
        <View style={global.field}>
          <Picker  
            value={data[0]}
            placeholder={'Month'}
            style={[global.input, { marginBottom: -16 }]}
            migrate 
            useSafeArea={true} 
            topBarProps={{ title: 'Month' }} 
            migrateTextField           
          >  
            {data.map((type) => (   
              <Picker.Item key={type.value} value={type.value} label={type.value.toString()} />
            ))}
          </Picker>
        </View>
        {/* <PieChart 
          data={data} 
          donut 
          showText
          textColor="black"
          innerRadius={50}
          showTextBackground
          textBackgroundColor="white"
          textBackgroundRadius={15} 
        /> */}
        {/* <LineChart data = {data} areaChart /> */}
        {/* <View flexG />
        <View row spread style={{ paddingVertical: 8 }}>
          <View style={{ width: "47.5%" }}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Report"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.btn} 
            />
          </View>
          <View style={{ width: "47.5%" }}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"CSV to Email"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.btn} 
            />
          </View>
        </View> */}

        <Button
          style={global.fab} 
          round 
          animateLayout 
          animateTo={'right'} 
          onPress={() => navigation.navigate("Report")} 
          backgroundColor="#32CD32" 
          iconSource={() => <MCIcon name="file-document" color="white" size={24} />} 
        /> 
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <View flex style={global.container}>
        <View style={global.field}>
          <Picker  
            value={data[0]}
            placeholder={'Month'}
            style={[global.input, { marginBottom: -16 }]}
            migrate 
            useSafeArea={true} 
            topBarProps={{ title: 'Month' }} 
            migrateTextField           
          >  
            {data.map((type) => (   
              <Picker.Item key={type.value} value={type.value} label={type.value.toString()} />
              ))}
          </Picker>
        </View>
        {/* <PieChart 
          data={data} 
          donut 
          showText
          textColor="black"
          innerRadius={50}
          showTextBackground
          textBackgroundColor="white"
          textBackgroundRadius={15} 
        /> */}
        {/* <View flexG />
        <View row spread style={{ paddingVertical: 8 }}>
          <View style={{ width: "47.5%" }}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Report"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.btn} 
            />
          </View>
          <View style={{ width: "47.5%" }}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"CSV to Email"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.btn} 
            />
          </View>
        </View> */}
        <Button
          style={global.fab} 
          round 
          animateLayout 
          animateTo={'right'} 
          onPress={() => navigation.navigate("Report")} 
          backgroundColor="#32CD32" 
          iconSource={() => <MCIcon name="file-document" color="white" size={24} />} 
        /> 
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={global.flex}>
      <View useSafeArea flex style={global.bgWhite}>
        <TabController items={[{label: 'Categories'}, {label: 'Products'}]}>  
          <TabController.TabBar 
            indicatorInsets={0}
            indicatorStyle={{ backgroundColor: "#32CD32" }} 
            selectedLabelColor={global.activeTabTextColor.color}
            labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
          />  
          <View flex>    
            <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
            <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
  );
}

export default Dashboard