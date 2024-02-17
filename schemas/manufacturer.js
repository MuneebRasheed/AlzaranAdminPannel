import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const validationSchema = Yup.object({
  manufacturerName: Yup.string().required('Manufacturer Name is required'),
});
