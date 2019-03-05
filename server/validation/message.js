import validator from 'validator';
import isEmpty from './is_empty';

const validateMessageInput = (data) => {
  const errors = {};
  const body = data;

  body.reciever = !isEmpty(body.reciever) ? body.reciever : '';
  body.message = !isEmpty(body.message) ? body.message : '';

  if (validator.isEmpty(body.reciever)) {
    errors.reciever = 'reciever field is required';
  }

  if (!validator.isEmail(body.reciever)) {
    errors.reciever = 'reciever is invalid';
  }

  if (validator.isEmpty(body.message)) {
    errors.message = 'No message sent';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateMessageInput;
