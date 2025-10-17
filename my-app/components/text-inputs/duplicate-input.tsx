import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface DuplicateInputProps {
  label: string;
  previousValue: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  secureTextEntry?: boolean;
  onErrorChange: (hasError: boolean) => void;
}

const DuplicateInput: React.FC<DuplicateInputProps> = ({
  label,
  previousValue,
  value,
  onChangeText,
  errorMessage = "Values do not match!",
  secureTextEntry = false,
  onErrorChange,
}) => {
  
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const hasErrors = value.length > 0 && value !== previousValue;

  React.useEffect(() => {
    onErrorChange(hasErrors);
  }, [hasErrors, onErrorChange]);

  return (
    <View>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isTextVisible}
        error={hasErrors}
        right={
          secureTextEntry && (
            <TextInput.Icon
              icon={isTextVisible ? "eye-off" : "eye"}
              onPress={() => setIsTextVisible(!isTextVisible)}
            />
          )
        }
      />
      <HelperText type="error" visible={hasErrors}>
        {errorMessage}
      </HelperText>
    </View>
  );
};

export default DuplicateInput;

// Examples
// {
// 	<DuplicateInput
// 	label="Confirm Email"
// 	previousValue={email}
// 	value={confirmEmail}
// 	onChangeText={setConfirmEmail}
// 	errorMessage="Emails do not match!"
// 	/>

// 	// Username confirmation
// 	<DuplicateInput
// 	label="Confirm Username"
// 	previousValue={username}
// 	value={confirmUsername}
// 	onChangeText={setConfirmUsername}
// 	/>
// }