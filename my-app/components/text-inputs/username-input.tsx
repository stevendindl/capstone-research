import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface UsernameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onErrorChange: (hasError: boolean) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ value, onChangeText, onErrorChange }) => {

	const tooShort = () => {
		return value.length < 4 && value.length > 0;
	};

	const tooLong = () => {
		return value.length > 16;
	};

	const specialCharacters = () => {
		return /[^a-zA-Z0-9._-]/.test(value);
	};

	const hasErrors = tooShort() || tooLong() || specialCharacters();
	  
	React.useEffect(() => {
		onErrorChange(hasErrors);
	}, [hasErrors, onErrorChange]);

	const getErrorMessage = () => {
		if (tooShort()) return "Username is too short.";
		if (tooLong()) return "Username is too long.";
		if (specialCharacters()) return "Only '.', '-', and '_' are allowed as special characters and no spaces.";
		return "";
	};

	return (
		<View>
		<TextInput label="Username" value={value} onChangeText={onChangeText} error={hasErrors} />
		<HelperText type="error" visible={hasErrors}>
			{
				getErrorMessage()
			}
		</HelperText>
		</View>
	);
};

export default UsernameInput;