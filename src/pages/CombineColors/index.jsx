/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { validationSchema } from '../../../schemas/combine-colors';
import { addColor, put } from '@/store/colors-actions';

export default function CombineColors() {
  const manufacturersOptions = useSelector(
    (state) => state.manufacture.mtSearchOptions,
  );
  const { colors } = useSelector(
    (state) => state.colors,
  );
  const router = useRouter();

  const { id } = router.query;

  const [editColorId, setEditColorId] = useState(null);

  const alreadyExist = (body) => {
    let combineColors = colors.filter((color) => color.isCombineColor === true);

    if (editColorId) {
      combineColors = combineColors.filter((color) => color.id !== editColorId);
    }

    const obj = combineColors.find(
      ({
        colorCode, yearFrom, yearTo,
      }) => (
        body.colorCode === colorCode &&
          yearFrom === body.yearFrom &&
          yearTo === body.yearTo
      ),
    );

    return obj;
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      manufacturerName: null,
      colorCode: '',
      combineColors: null,
      yearFrom: '',
      yearTo: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const {
        manufacturerName, colorCode, combineColors, yearFrom, yearTo, description,
      } = values;
      const body = {
        imgUrl: '',
        manufacturer: manufacturerName.value,
        colorCode,
        colorName: description,
        yearFrom,
        yearTo,
        variant: '',
        modelVersion: new Date().toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        }),
        colorType: null,
        combineColors: combineColors.map(({ value }) => value),
        isCombineColor: true,
      };
      const toastId = toast.loading(`${editColorId ? 'Editing' : 'Creating'} Color`);
      try {
        if (alreadyExist(body)) {
          toast.error('Already Exits', { id: toastId });
          return;
        }

        if (editColorId) {
          await dispatch(put({ id: editColorId, data: body }));
        } else {
          await dispatch(addColor(body));
        }
        router.push('/Colors');
        resetForm();
        toast.success(`${editColorId ? 'Edited' : 'Created'} Color`, { id: toastId });
      } catch (error) {
        console.error('error', error);
        toast.error(`Failed to ${editColorId ? 'Editing' : 'Creating'} color`, { id: toastId });
      }
    },
  });

  const colorsOptions = colors
    .filter(({ manufacturer, isCombineColor }) => manufacturer === formik.values.manufacturerName?.value && !isCombineColor)
    // eslint-disable-next-line no-shadow
    .map(({ id, colorCode }) => ({ value: id, label: colorCode }));

  const onBackClick = () => {
    router.push('/Colors');
  };

  useEffect(() => {
    if (id) {
      const edit = colors.find((color) => color.id === id);
      if (edit) {
        // manufacturerName: '',
        formik.setFieldValue('colorCode', edit.colorCode);
        formik.setFieldValue('yearFrom', edit.yearFrom);
        formik.setFieldValue('yearTo', edit.yearTo);
        formik.setFieldValue('description', edit.colorName);
        const manufacturerOpt = manufacturersOptions.find(((mo) => mo.value === edit.manufacturer));
        formik.setFieldValue('manufacturerName', manufacturerOpt);
        const combineColorsArray = edit.combineColors.map((colorId) => colorsOptions.find((color) => color.value === colorId));
        formik.setFieldValue('combineColors', combineColorsArray);
        setEditColorId(edit.id);
      } else {
        router.push('/Colors');
      }
    }

  }, [id]);

  return (
    <section id="combine" className="section">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter px-3">Combine Colors</h1>

        <div className="row p-3">
          <div className="p-4 bg-white">
            <form onSubmit={formik.handleSubmit}>
              <div className="row d-flex align-items-center">
                {/* Manufacturer Name */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Manufacturer Name</p>
                  <Select
                    options={manufacturersOptions}
                    onChange={(selectedOption) => formik.setFieldValue('manufacturerName', selectedOption)}
                    value={formik.values.manufacturerName}
                  />
                  {formik.touched.manufacturerName &&
                formik.errors.manufacturerName ? (
                  <div className="text-danger">
                    {formik.errors.manufacturerName.value}
                  </div>
                    ) : null}
                </div>

                {/* Color Code */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Color Code</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Color Code"
                    {...formik.getFieldProps('colorCode')}
                  />
                  {formik.touched.colorCode && formik.errors.colorCode && (
                    <div className="text-danger">{formik.errors.colorCode}</div>
                  )}
                </div>

                {/* Combine Colors */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Combine Colors</p>
                  <Select
                    isMulti
                    options={colorsOptions}
                    value={formik.values.combineColors}
                    onChange={(selectedOptions) => formik.setFieldValue('combineColors', selectedOptions)}
                  />
                  {formik.touched.combineColors && formik.errors.combineColors && (
                    <div className="text-danger">{formik.errors.combineColors}</div>
                  )}
                </div>

                {/* Year(from) */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Year(from)</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Select by name"
                    {...formik.getFieldProps('yearFrom')}
                  />
                  {formik.touched.yearFrom && formik.errors.yearFrom && (
                    <div className="text-danger">{formik.errors.yearFrom}</div>
                  )}
                </div>

                {/* Year(to) */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Year(to)</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Select by name"
                    {...formik.getFieldProps('yearTo')}
                  />
                  {formik.touched.yearTo && formik.errors.yearTo && (
                    <div className="text-danger">{formik.errors.yearTo}</div>
                  )}
                </div>

                {/* Description */}
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Description</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Description"
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description &&
                    formik.errors.description && (
                      <div className="text-danger">
                        {formik.errors.description}
                      </div>
                  )}
                </div>

                {/* Save and Back buttons */}
                <div className="col-12 d-flex align-items-center justify-content-end pt-4">
                  <button type="submit" className="btn btn-dark">
                    Save
                  </button>
                  <button type="button" className="btn btn-danger ms-2" onClick={onBackClick}>Back</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
