import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onErrorChange: (hasError: boolean) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChangeText, onErrorChange }) => {
  
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const tooShort = () => {
    return value.length < 8 && value.length > 0;
  };

  const containsLessThan2Numbers = () => {
    const numbers = value.match(/\d/g);
    return value.length > 0 && (!numbers || numbers.length < 2);
  };

  const hasErrors = tooShort() || containsLessThan2Numbers();
  
  React.useEffect(() => {
    onErrorChange(hasErrors);
  }, [hasErrors, onErrorChange]);

  const getErrorMessage = () => {
    if (tooShort()) return "Password must be at least 8 characters";
    if (containsLessThan2Numbers()) return "Password must contain at least 2 numbers";
    return "";
  };

  return (
    <View>
      <TextInput
        label="Password"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        error={hasErrors}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
      />
      <HelperText type="error" visible={hasErrors}>
        {getErrorMessage()}
      </HelperText>
    </View>
  );
};

export default PasswordInput;