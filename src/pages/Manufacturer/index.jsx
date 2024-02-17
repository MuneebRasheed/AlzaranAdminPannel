/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { validationSchema } from '../../../schemas/manufacturer';
import { addManufacture, del, put } from '@/store/manufacture-actions';
import PaginatedTable from '@/components/PaginatedTable';
import { filter, resetSearch } from '@/store/manufacture';
import DeleteModal from '@/components/DeleteModal';

const headers = [
  { key: 'idToDisplay', label: 'Manufacturer id', prefix: 'M-' },
  { label: 'Manufacturer Name', key: 'name' },
  { label: 'Created On', key: 'createdAt' },
  { label: 'Modified On', key: 'updatedAt' },
];

function ManufacturerSection() {
  const {
    searching,
    manufacturers,
    filteredManufacturers,
    mtSearchOptions,
  } =
    useSelector((state) => state.manufacture);
  const dispatch = useDispatch();
  const [editManufacture, setEditManufacture] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteManufacturer, setDeleteManufacturer] = useState(null);

  const isTypeExists = (selectedName) => manufacturers.find(({ name }) => name === selectedName);

  const handleEdit = async (values, resetForm) => {
    const toastId = toast.loading('Editing Manufacturer!');
    try {
      const type = isTypeExists(values.manufacturerName);
      if (type && type.name !== editManufacture.name) {
        toast.error(`${values.manufacturerName} Manufacturer Already Exist`, {
          id: toastId,
        });
        return;
      }
      const data = { ...editManufacture, name: values.manufacturerName };
      await dispatch(put({ id: data.id, data }));
      resetForm();
      setEditManufacture(null);
      toast.success('Edited successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to Edit Manufacturer', { id: toastId });
    }
  };

  const handleAdd = async (values, resetForm) => {
    const toastId = toast.loading('Creating Manufacturer');
    try {
      if (isTypeExists(values.manufacturerName)) {
        toast.error(`${values.manufacturerName} Manufacturer Already Exist`, {
          id: toastId,
        });
        return;
      }
      await dispatch(addManufacture(values.manufacturerName));
      resetForm();
      toast.success('Created successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to create Manufacturers', { id: toastId });
    }
  };

  const formik = useFormik({
    initialValues: {
      manufacturerName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editManufacture) {
        await handleEdit(values, resetForm);
      } else {
        await handleAdd(values, resetForm);
      }
    },
  });

  const onEdit = (value) => {
    setEditManufacture(value);
    formik.setFieldValue('manufacturerName', value.name);
  };

  const onDelete = async (value) => {
    setDeleteManufacturer(value);
    setShowDeleteModal(true);
  };

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const handleReset = () => {
    setSelectedOption(null);
    dispatch(resetSearch());
  };

  const handleSearch = () => {
    if (selectedOption?.label) dispatch(filter(selectedOption?.label || ''));
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting Manufacturer');
    try {
      await dispatch(del(deleteManufacturer.id));
      toast.success(`${deleteManufacturer.name} Deleted!`, {
        id: toastId,
      });
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(`Failed to Delete ${deleteManufacturer.name}`, {
        id: toastId,
      });
    }
  };

  const sortManufacturers = (passManufacturers) => {
    // Create a copy of the original array to avoid modifying it directly
    const sortedArray = [...passManufacturers];

    sortedArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

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
    <section id="manu" className="section">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter p-3">Manufacturers</h1>
        <div className="p-4 bg-white">
          <p className="fs-5">Create manufacturer</p>
          <div className="row d-flex align-items-center">
            <p className="mb-0">Manufacturer name</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex" style={{ gap: '12px' }}>
                <div>
                  <input
                    type="text"
                    className={`form-control w-100 ${
                      formik.touched.manufacturerName &&
                    formik.errors.manufacturerName
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="MANUFACTURER NAME"
                    id="manufacturerName"
                    name="manufacturerName"
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      const capitalizedInput = e.target.value.toUpperCase();
                      formik.setFieldValue('manufacturerName', capitalizedInput);
                    }}
                    value={formik.values.manufacturerName}
                  />
                  {formik.touched.manufacturerName &&
                formik.errors.manufacturerName ? (
                  <div className="invalid-feedback">
                    {formik.errors.manufacturerName}
                  </div>
                    ) : null}
                </div>
                <div className="p-0 ml-1">
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
            <p className="mb-0">Manufacturer name</p>
            <div className="col-4">
              <Select
                options={mtSearchOptions}
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
        data={searching ? sortManufacturers(filteredManufacturers) : sortManufacturers(manufacturers)}
        headers={headers}
        showActions
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <DeleteModal
        show={showDeleteModal}
        handleDelete={handleDelete}
        handleClose={() => setShowDeleteModal(false)}
      />
    </section>
  );
}

export default ManufacturerSection;
