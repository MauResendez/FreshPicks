import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Button, Colors, Picker, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const data = [ {value:50}, {value:80}, {value:90}, {value:70} ];
  const layout = useWindowDimensions();
  const width = layout.width/3;
  const pieData = [{value: 47, color: '#009FFF', gradientCenterColor: '#006DFF', focused: true}, {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'}, {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'}, {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},];

  const renderDot = color => {

    return (
  
      <View
  
        style={{
  
          height: 10,
  
          width: 10,
  
          borderRadius: 5,
  
          backgroundColor: color,
  
          marginRight: 10,
  
        }}
  
      />
  
    );
  
  };
  
  
  const renderLegendComponent = () => {
  
    return (
  
      <>
  
        <View
  
          style={{
  
            flexDirection: 'row',
  
            justifyContent: 'center',
  
            marginBottom: 10,
  
          }}>
  
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20
            }}>
            {renderDot('#006DFF')}
            <Text text80M grey30 marginV-4>Excellent: 47%</Text>
          </View>
  
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
            {renderDot('#8F80F3')}
            <Text text80M grey30 marginV-4>Okay: 16%</Text>
          </View>
        </View>
  
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20
            }}>
            {renderDot('#3BE9DE')}
            <Text text80M grey30 marginV-4>Good: 40%</Text>
          </View>
  
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
            {renderDot('#FF7F97')}
            <Text text80M grey30 marginV-4>Poor: 3%</Text>
          </View>
        </View>
      </>
    );
  
  };

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
        <PieChart 
          data={data} 
          donut 
          showText
          textColor={Colors.black}
          innerRadius={50}
          showTextBackground
          textBackgroundColor={Colors.white}
          textBackgroundRadius={15} 
        />
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
          backgroundColor={Colors.tertiary}
          iconSource={() => <MCIcon name="file-document" color={Colors.white} size={24} />} 
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
            title={'Month'}
            label={'Month'}
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
          textColor={Colors.black}
          innerRadius={50}
          showTextBackground
          textBackgroundColor={Colors.white}
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
          backgroundColor={Colors.tertiary}
          iconSource={() => <MCIcon name="file-document" color={Colors.white} size={24} />} 
        /> 
      </View>
    </View>
  );

  return (
    <View flex style={[global.container, global.bgWhite]}>
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

      <View
        style={{
          padding: 16,
          borderRadius: 20,
          backgroundColor: 'white'
        }}>
        <Text text65 marginV-4>
          Performance
        </Text>

        <View style={{padding: 20, alignItems: 'center'}}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            centerLabelComponent={() => {
              return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                    47%
                  </Text>
                  <Text style={{fontSize: 14, color: 'white'}}>Excellent</Text>
                </View>
              );
            }}
          />
        </View>

        {renderLegendComponent()}
      </View>
    </View>
  );

  // return (
  //   <GestureHandlerRootView style={global.flex}>
  //     <View useSafeArea flex style={global.bgWhite}>
  //       <TabController items={[{label: 'Categories'}, {label: 'Products'}]}>  
  //         <TabController.TabBar 
  //           indicatorInsets={0}
  //           indicatorStyle={{ backgroundColor: Colors.primary }} 
  //           selectedLabelColor={global.activeTabTextColor.color}
  //           labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
  //         />  
  //         <View flex>    
  //           <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
  //           <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
  //         </View>
  //       </TabController>
  //     </View>
  //   </GestureHandlerRootView>
  // );
}

export default Dashboard