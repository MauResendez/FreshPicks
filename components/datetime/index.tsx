import { createElement } from 'react-native-web';

const DateTimePicker = ({ value, onChange }) => {
	return createElement('input', {
    type: 'time',
    value: value,
    onInput: onChange,
  });
}

export default DateTimePicker