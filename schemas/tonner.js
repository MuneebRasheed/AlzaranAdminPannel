import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const validationSchema = Yup.object({
  tonner: Yup.string().required('Tonner is required'),
  weightPercentage: Yup.number()
    .required('Weight % is required')
    .min(0, 'Weight % must be greater than or equal to 0'),
  weightPerLiter: Yup.number()
    .required('Weight per liter is required')
    .min(0, 'Weight per liter must be greater than or equal to 0'),
  weightPerKg: Yup.number()
    .required('Weight per kg is required')
    .min(0, 'Weight per kg must be greater than or equal to 0'),
  tonnerCodeColor: Yup.string().required('Tonner Code Color is required'),
});
