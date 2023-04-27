import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
// import { PieChart } from "react-native-gifted-charts";
import { Colors, Picker, TabController, Text, View } from "react-native-ui-lib";
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const data = [ {value:50}, {value:80}, {value:90}, {value:70} ];
  const layout = useWindowDimensions();

  const FirstRoute = () => (
    <View useSafeArea flex>
      <View style={[global.center, global.container]}>
        <Text subtitle>Generate reports here</Text>
        <View style={global.field}>
          <Text h3>Showing statistics for</Text>
          <Picker  
            value={data[0]}
            placeholder={'Listing Type'}
            placeholderTextColor={Colors.black}
            style={[global.input, { marginBottom: -16 }]}
            migrate 
            useSafeArea={true} 
            topBarProps={{ title: 'Listing Types' }} 
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
        <Text h3>Data 1</Text>
        <Text h3>Data 2</Text>
        <Text h3>Data 3</Text>
        <Text h3>Data 4</Text>
        <Text h2>Report</Text>
        <Text h2>CSV to Email</Text>
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <View style={[global.center, global.container]}>
        <Text subtitle>Generate reports here</Text>
        <View style={global.field}>
          <Text h3>Showing statistics for</Text>
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
        <Text h3>Data 1</Text>
        <Text h3>Data 2</Text>
        <Text h3>Data 3</Text>
        <Text h3>Data 4</Text>
        <Text h2>Report</Text>
        <Text h2>CSV to Email</Text>
      </View>
    </View>
  );

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <TabController items={[{label: 'Categories'}, {label: 'Products'}, {label: 'Type'}]}>  
        <TabController.TabBar 
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: "#32CD32", flex: 1 }} 
          selectedLabelColor={global.activeTabTextColor.color}
          equalSize
        />  
        <View flex>    
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
        </View>
      </TabController>
    </View>
  );
}

export default Dashboard