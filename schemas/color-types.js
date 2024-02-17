import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const colorTypeValidationSchema = Yup.object({
  colorTypeName: Yup.string().required('Please enter valid ColorType name'),
});
