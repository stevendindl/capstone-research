import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onErrorChange: (hasError: boolean) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({value, onChangeText, onErrorChange}) => {


	const hasErrors = !value.includes('@') && value.length > 0;
			  
	React.useEffect(() => {
		onErrorChange(hasErrors);
	}, [hasErrors, onErrorChange]);

	

	return (
		<View>
		<TextInput label="Email" value={value} onChangeText={onChangeText} error={hasErrors} />
		<HelperText type="error" visible={hasErrors}>
			Email address is invalid!
		</HelperText>
		</View>
	);
};

export default EmailInput;