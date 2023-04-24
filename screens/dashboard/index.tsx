import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
// import { PieChart } from "react-native-gifted-charts";
import { SceneMap } from "react-native-tab-view";
import { Colors, Picker, TabController, Text, View } from "react-native-ui-lib";
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const data = [ {value:50}, {value:80}, {value:90}, {value:70} ];
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Categories" },
    { key: "second", title: "Products" },
  ]);

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

  const renderLabel = ({ route, focused, color }) => {
    return (
      <Text style={[focused ? global.activeTabTextColor : global.tabTextColor]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View useSafeArea flex>
      {/* <TabView
        style={global.bgWhite}
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: global.activeTabTextColor.color }}
            style={{ backgroundColor: "white", height: 50 }}
            renderLabel={renderLabel}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      /> */}
      <TabController items={[{label: 'Categories'}, {label: 'Products'}]}>  
        <TabController.TabBar spreadItems indicatorStyle={global.activeTabTextColor} />  
        <View flex style={global.bgWhite}>    
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
        </View>
      </TabController>
    </View>
  );
}

export default Dashboard