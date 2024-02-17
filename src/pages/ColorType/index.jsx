/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { colorTypeValidationSchema } from '../../../schemas/color-types';
import {
  create,
  updateColorType,
  deleteColorType,
} from '../../../services/color-types';
import PaginatedTable from '@/components/PaginatedTable';
import {
  addColorType,
  filterColorType,
  resetSearch,
  update,
  deleteType,
} from '../../store/color-type';
import DeleteModal from '@/components/DeleteModal';

const headers = [
  { key: 'idToDisplay', label: 'Color Type Id', prefix: 'CT-' },
  { label: 'Color Type', key: 'name' },
  { label: 'Created On', key: 'createdAt' },
  { label: 'Modified On', key: 'updatedAt' },
];

export default function ColorType() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [editColorType, setEditColorType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteColor, setDeleteColor] = useState(null);

  const {
    colorTypes, ctSearchOptions, searching, filteredColorTypes,
  } =
    useSelector((state) => state.colorType);

  const isColorTypeExists = (selectedName) => colorTypes.find(({ name }) => name === selectedName);

  const dispatch = useDispatch();

  const handleAdd = async (values, resetForm) => {
    const toastId = toast.loading('Creating Color Type');
    try {
      if (isColorTypeExists(values.colorTypeName)) {
        toast.error(`${values.colorTypeName} Color Already Exist`, {
          id: toastId,
        });
        return;
      }
      const id = colorTypes.length === 0 ? 0 : colorTypes.reduce((max, obj) => (obj.idToDisplay > max ? obj.idToDisplay : max), 0) + 1;

      const colorType = await create(values.colorTypeName, id);

      dispatch(addColorType(colorType));
      resetForm();
      toast.success('Created successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to create Color Type', { id: toastId });
    }
  };

  const handleEditColorType = async (values, resetForm) => {
    const toastId = toast.loading('Editing Color Type');
    try {
      const type = isColorTypeExists(values.colorTypeName);
      if (type && type.name !== editColorType.name) {
        toast.error(`${values.colorTypeName} Color Already Exist`, {
          id: toastId,
        });
        return;
      }
      const data = { ...editColorType, name: values.colorTypeName };
      const colorType = await updateColorType(data.id, data);
      dispatch(update({ id: data.id, updatedColorType: colorType }));
      resetForm();
      setEditColorType(null);
      toast.success('Edited successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to Edit Color Type', { id: toastId });
    }
  };
  const formik = useFormik({
    initialValues: {
      colorTypeName: '',
    },
    validationSchema: colorTypeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editColorType) {
        await handleEditColorType(values, resetForm);
      } else {
        await handleAdd(values, resetForm);
      }
    },
  });

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const handleReset = () => {
    setSelectedOption(null);
    dispatch(resetSearch());
  };

  const handleEdit = (colorType) => {
    setEditColorType(colorType);
    formik.setFieldValue('colorTypeName', colorType.name);
  };

  const onDelete = async (colorType) => {
    setDeleteColor(colorType);
    setShowDeleteModal(true);
  };

  const handleSearch = () => {
    if (selectedOption?.label) {
      dispatch(filterColorType(selectedOption.label));
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting Color Type');
    try {
      await deleteColorType(deleteColor.id);
      toast.success(`${deleteColor.name} Deleted!`, {
        id: toastId,
      });
      dispatch(deleteType(deleteColor.id));
      setDeleteColor(null);
      setShowDeleteModal(false); // Close the modal after deletion
    } catch (error) {
      toast.error(`Failed to Delete ${deleteColor.name}`, {
        id: toastId,
      });
    }
  };

  const sortColorTypes = (passColorTypes) => {
    // Create a copy of the original array to avoid modifying it directly
    const sortedArray = [...passColorTypes];

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
    <section id="color" className="section">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter p-3">ColorType</h1>
        <div className="p-4 bg-white">
          <p className="fs-5">Create Color Type</p>
          <div className="row d-flex align-items-center">
            <p className="mb-0">Color Type</p>
            <form className="row" onSubmit={formik.handleSubmit}>
              <div className="col-4">
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="COLORTYPE NAME"
                  name="colorTypeName"
                  value={formik.values.colorTypeName}
                  onChange={(e) => {
                    const capitalizedInput = e.target.value.toUpperCase();
                    formik.setFieldValue('colorTypeName', capitalizedInput);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.colorTypeName && formik.errors.colorTypeName ? (
                  <div className="text-danger">
                    {formik.errors.colorTypeName}
                  </div>
                ) : null}
              </div>
              <div className="col-8 p-0">
                <button type="submit" className="btn btn-dark">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-fluid p-0">
        <div className="p-4 bg-white mt-3">
          <div className="row">
            <p className="mb-0">Search Color Type</p>
            <div className="col-4">
              <Select
                options={ctSearchOptions}
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
        data={searching ? sortColorTypes(filteredColorTypes) : sortColorTypes(colorTypes)}
        headers={headers}
        showActions
        onEdit={handleEdit}
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
