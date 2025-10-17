import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onErrorChange: (hasError: boolean) => void;
}

const UsernameOrEmailInput: React.FC<InputProps> = ({ value, onChangeText, onErrorChange }) => {
	
	const hasErrors = false;
		  
	React.useEffect(() => {
		onErrorChange(hasErrors);
	}, [hasErrors, onErrorChange]);

	const getErrorMessage = () => {
		// if (tooShort()) return "Username is too short!";
		// if (tooLong()) return "Username is too long!";
		return "";
	};

	return (
		<View>
		<TextInput label="Username / Email" value={value} onChangeText={onChangeText} error={hasErrors} />
		<HelperText type="error" visible={hasErrors}>
			{
				getErrorMessage()
			}
		</HelperText>
		</View>
	);
};

export default UsernameOrEmailInput;