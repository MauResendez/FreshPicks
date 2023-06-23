import React, { useState } from 'react';
import { KeyboardAwareScrollView, RadioButton, RadioGroup, Text, TextField, View } from 'react-native-ui-lib';
import { global } from '../../style';

const Report = () => {
	const [reason, setReason] = useState();
	const [details, setDetails] = useState("");

	return (
		<KeyboardAwareScrollView style={[global.white, { flexGrow: 1 }]}>
			<View padding-24>
				<Text text65 marginV-4 numberOfLines={1}>Reason for the report:</Text>
				<RadioGroup initialValue={reason} onValueChange={(reason) => setReason(reason)}>  
					<RadioButton value={'Harassment'} label={'Harassment'} style={{ marginVertical: 16 }} />  
					<RadioButton value={'Impersonation'} label={'Impersonation'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Spam'} label={'Spam'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Inappropriate Content'} label={'Inappropriate Content'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Privacy Invasion'} label={'Privacy Invasion'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Threats or Violence'} label={'Threats or Violence'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Copyright or Intellectual Property Infringement'} label={'Copyright or Intellectual Property Infringement'} style={{ marginVertical: 16 }} />
					<RadioButton value={'Account Hacking'} label={'Account Hacking'} style={{ marginVertical: 16 }} />
				</RadioGroup>

				<Text text80M grey30 marginV-4>Explain your reason(s) for the report</Text>
				<TextField 
					value={details} 
					onChangeText={(details) => setDetails(details)} 
					style={global.area} 
					placeholder="Describe your reason(s) for the report" 
					maxLength={250} 
				/>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default Report