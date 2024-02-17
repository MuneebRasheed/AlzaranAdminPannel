import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const validationSchema = yup.object({
  manufacturerName: yup.object().shape({
    value: yup.string().required('Manufacturer Name is required'),
    label: yup.string().required('Manufacturer Name is required'),
  }),
  colorCode: yup.string().required('Color code is required'),
  combineColors: yup.array().required('Please select atleast one color'),
  yearFrom: yup.string().required('Year (from) is required'),
  yearTo: yup.string().required('Year (to) is required'),
  description: yup.string(),
});
