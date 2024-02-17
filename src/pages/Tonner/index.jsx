/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { validationSchema } from '../../../schemas/tonner';
// eslint-disable-next-line import/extensions
import PaginatedTable from '@/components/PaginatedTable';
import { add, put, del } from '@/store/tonner-actions';
import { filter, resetSearch } from '@/store/tonner';

const headers = [
  { key: 'idToDisplay', label: 'Tonner id', prefix: 'T-' },
  { label: 'Mass Tone', key: 'tonnerCodeColor', type: 'color' },
  { label: 'Tonner Name', key: 'tonner' },
  { label: 'Weight %', key: 'weightPercentage' },
  { label: 'Weight/ltr', key: 'weightPerLiter' },
  { label: 'Weight/kg', key: 'weightPerKg' },
  { label: 'Created On', key: 'createdAt' },
  { label: 'Modified On', key: 'updatedAt' },
];

export default function Tonner() {

  const {
    searching,
    filteredTonners,
    tSearchOptions,
    tonners,
  } =
    useSelector((state) => state.tonner);

  const dispatch = useDispatch();
  const [editTonner, setEditTonner] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const isTypeExists = (selectedName) => tonners.find(({ tonner }) => tonner === selectedName);

  const handleEdit = async (values, resetForm) => {
    const toastId = toast.loading('Editing Tonner!');
    try {
      const type = isTypeExists(values.tonner);
      if (type && type.tonner !== editTonner.tonner) {
        toast.error(`${values.manufacturerName} Tonner Already Exist`, {
          id: toastId,
        });
        return;
      }
      const data = { ...editTonner, ...values };
      await dispatch(put({ id: data.id, data }));
      resetForm();
      setEditTonner(null);
      toast.success('Edited successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to Edit Tonner', { id: toastId });
    }
  };

  const handleAdd = async (values, resetForm) => {
    const toastId = toast.loading('Creating Tonner');
    try {
      if (isTypeExists(values.tonner)) {
        toast.error(`${values.tonner} Tonner Already Exist`, {
          id: toastId,
        });
        return;
      }
      await dispatch(add(values));
      resetForm();
      toast.success('Created successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to create Tonner', { id: toastId });
    }
  };

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const handleReset = () => {
    setSelectedOption(null);
    dispatch(resetSearch());
  };

  const formik = useFormik({
    initialValues: {
      tonner: '',
      weightPercentage: '',
      weightPerLiter: '',
      weightPerKg: '',
      tonnerCodeColor: '#000000', // default color
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editTonner) {
        await handleEdit(values, resetForm);
      } else {
        await handleAdd(values, resetForm);
      }
    },
  });

  const onEdit = (value) => {
    setEditTonner(value);
    formik.setFieldValue('tonner', value.tonner);
    formik.setFieldValue('weightPercentage', value.weightPercentage);
    formik.setFieldValue('weightPerLiter', value.weightPerLiter);
    formik.setFieldValue('weightPerKg', value.weightPerKg);
    formik.setFieldValue('tonnerCodeColor', value.tonnerCodeColor);
  };

  const onDelete = async (value) => {
    const toastId = toast.loading('Deleting Tonner');
    try {
      await dispatch(del(value.id));
      toast.success(`${value.tonner} Deleted!`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(`Failed to Delete ${value.tonner}`, {
        id: toastId,
      });
    }
  };

  const handleSearch = () => {
    if (selectedOption?.label) dispatch(filter(selectedOption?.label || ''));
  };

  const sortTonners = (pass) => {
    // Create a copy of the original array to avoid modifying it directly
    const sortedArray = [...pass];

    sortedArray.sort((a, b) => {
      const nameA = a.tonner.toLowerCase();
      const nameB = b.tonner.toLowerCase();

      // Check if both names are numeric
      const isANumeric = /^\d+$/.test(nameA);
      const isBNumeric = /^\d+$/.test(nameB);

      // Sort numeric values first in ascending order
      if (isANumeric && isBNumeric) {
        return Number(nameA) - Number(nameB);
      } if (isANumeric) {
        return -1; // Numeric values come before alphabetic values
      } if (isBNumeric) {
        return 1; // Numeric values come before alphabetic values
      }

      // Sort alphabetical values in ascending order
      return nameA.localeCompare(nameB);
    });

    return sortedArray;
  };

  return (
    <section id="tonner" className="section">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter p-3">Tonners</h1>
        <div className="p-4 bg-white">
          <p className="fs-5">Create tonner</p>
          <div className="row d-flex align-items-center">
            <form onSubmit={formik.handleSubmit}>
              <div className="row d-flex align-items-center">
                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Tonner</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="TONNER"
                    name="Tonner"
                    value={formik.values.tonner}
                    onChange={(e) => {
                      const capitalizedInput = e.target.value.toUpperCase();
                      formik.setFieldValue('tonner', capitalizedInput);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.tonner && formik.errors.tonner ? (
                    <div className="text-danger">{formik.errors.Tonner}</div>
                  ) : null}
                </div>

                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Weight %</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Weight %"
                    name="weightPercentage"
                    value={formik.values.weightPercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.weightPercentage &&
                  formik.errors.weightPercentage ? (
                    <div className="text-danger">
                      {formik.errors.weightPercentage}
                    </div>
                    ) : null}
                </div>

                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Weight per liter</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Weight per liter"
                    name="weightPerLiter"
                    value={formik.values.weightPerLiter}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.weightPerLiter &&
                  formik.errors.weightPerLiter ? (
                    <div className="text-danger">
                      {formik.errors.weightPerLiter}
                    </div>
                    ) : null}
                </div>

                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Weight per kg</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Weight per kg"
                    name="weightPerKg"
                    value={formik.values.weightPerKg}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.weightPerKg && formik.errors.weightPerKg ? (
                    <div className="text-danger">
                      {formik.errors.weightPerKg}
                    </div>
                  ) : null}
                </div>

                <div className="col-4 d-flex flex-column">
                  <p className="mb-0">Tonner Code Color</p>
                  <input
                    type="color"
                    className="form-control w-100"
                    style={{ minHeight: '38px' }}
                    name="tonnerCodeColor"
                    value={formik.values.tonnerCodeColor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.tonnerCodeColor &&
                  formik.errors.tonnerCodeColor ? (
                    <div className="text-danger">
                      {formik.errors.tonnerCodeColor}
                    </div>
                    ) : null}
                </div>

                <div className="col-4 p-0 align-self-end ps-3">
                  <button type="submit" className="btn btn-dark">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-fluid p-0">
        <div className="p-4 bg-white mt-3">
          <div className="row">
            <p className="mb-0">Search Tonner</p>
            <div className="col-4">
              <Select
                options={tSearchOptions}
                value={selectedOption}
                onChange={handleChange}
              />
            </div>
            <div className="col-8 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={handleSearch}
              >
                Search
              </button>

              <button
                type="button"
                className="btn btn-success ms-2"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <PaginatedTable
        data={searching ? sortTonners(filteredTonners) : sortTonners(tonners)}
        headers={headers}
        showActions
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
}
