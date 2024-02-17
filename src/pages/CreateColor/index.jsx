/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Button } from 'reactstrap';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { storage } from '../../../firebase';
import TonnerTable from '@/components/TonnerTable';
import { addColor, put } from '@/store/colors-actions';

function AddColorSection() {
  const manufacturersOptions = useSelector(
    (state) => state.manufacture.mtSearchOptions,
  );
  const ctOptions = useSelector((state) => state.colorType.ctSearchOptions);
  const tonnerOptions = useSelector((state) => state.tonner.tSearchOptions);
  const colors = useSelector((state) => state.colors.colors);

  const tonners = useSelector((state) => state.tonner.tonners);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [tonnerExistInTwoStage, setTonnerExistInTwoStage] = useState(false);
  const [tonnerExistInFirstStage, setTonnerExistInFirstStage] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [editColorId, setEditColorId] = useState(null);

  const dispatch = useDispatch();

  function areArraysOfObjectsEqual(arr1, arr2) {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort arrays of objects
    const sortedArr1 = arr1.slice().sort((a, b) => {
      if (a.abs !== b.abs) {
        return a.abs - b.abs; // Sort by 'abs' property
      }
      return a.tonner - b.tonner; // If 'abs' properties are equal, sort by 'tonner' property
    });

    const sortedArr2 = arr2.slice().sort((a, b) => {
      if (a.abs !== b.abs) {
        return a.abs - b.abs; // Sort by 'abs' property
      }
      return a.tonner - b.tonner; // If 'abs' properties are equal, sort by 'tonner' property
    });

    // Check if each object in both arrays is equal
    for (let i = 0; i < sortedArr1.length; i++) {
      const obj1 = sortedArr1[i];
      const obj2 = sortedArr2[i];

      // Check if objects have the same specified keys and values
      if (
        obj1.abs === obj2.abs &&
        obj1.tonner === obj2.tonner
      ) {
        // eslint-disable-next-line no-continue
        continue; // Objects are equal, continue to the next iteration
      } else {
        return false; // Objects are not equal
      }
    }

    // If all objects are equal, return true
    return true;
  }
  const alreadyExist = (body) => {
    let nonCombineColors = colors.filter((color) => color.isCombineColor !== true);

    if (editColorId) {
      nonCombineColors = nonCombineColors.filter((color) => color.id !== editColorId);
    }

    const obj = nonCombineColors.find(
      ({
        colorCode, yearFrom, yearTo, stageOneTonner, stageTwoTonner,
      }) => (
        body.colorCode === colorCode &&
          yearFrom === body.yearFrom &&
          yearTo === body.yearTo &&
          areArraysOfObjectsEqual(stageOneTonner, body.stageOneTonner) &&
          areArraysOfObjectsEqual(stageTwoTonner, body.stageTwoTonner)
      ),
    );

    return obj;
  };

  const getTonnerColor = (id) => {
    const tonner = tonners.find((t) => t.id === id);
    return tonner?.tonnerCodeColor || '#000';
  };

  const [showTonnerError, setShowTonnerError] = useState(false);
  const [stageTwo, setStageTwo] = useState(false);
  const [tonner, setTonner] = useState(null);
  const [abs, setAbs] = useState(null);
  const [stageOneTonner, setStageOneTonner] = useState([]);
  const [stageTwoTonner, setStageTwoTonner] = useState([]);

  const validationSchema = Yup.object({
    manufacturerName: Yup.object().shape({
      value: Yup.string().required('Manufacturer Name is required'),
      label: Yup.string().required('Manufacturer Name is required'),
    }),
    colorCode: Yup.string().required('Color Code is required'),
    colorName: Yup.string().required('Color Name is required'),
    variant: Yup.string(),
    yearFrom: Yup.string().required('Year From is required'),
    yearTo: Yup.string().required('Year To is required'),
    modelVersion: Yup.string(),
    colorTypeName: Yup.object()
      .nullable()
      .shape({
        value: Yup.string().required('Color Type Name is required'),
        label: Yup.string().required('Color Type Name is required'),
      }),
    stageOneTonner: Yup.array(),
    stageTwoTonner: Yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      manufacturerName: '',
      colorCode: '',
      colorName: '',
      variant: '',
      yearFrom: '',
      yearTo: '',
      modelVersion: new Date().toISOString().split('T')[0],
      colorTypeName: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (stageOneTonner.length === 0 && stageTwoTonner.length === 0) return;
      const {
        colorCode,
        manufacturerName,
        colorName,
        yearFrom,
        yearTo,
        variant,
        modelVersion,
        colorTypeName,
      } = values;
      let OneTonner=stageOneTonner.map(({ tonner, }) => tonner.value)
      let TwoTonner=stageTwoTonner.map(({ tonner, }) => tonner.value)
      const body = {
        imgUrl,
        manufacturer: manufacturerName.value,
        colorCode,
        colorName,
        yearFrom,
        layer:stageTwo==true?2:1,
        colorsTypesName:colorTypeName?.label,
        yearTo,
        variant,
        modelVersion,
        colorType: colorTypeName?.value|| null,
        stageOneTonner: stageOneTonner.map(({ tonner, abs }) => ({
          abs,
          tonner: tonner.value,
        })),
        stageTonner:[...OneTonner,...TwoTonner],
        stageTwoTonner: stageTwoTonner.map(({ tonner, abs }) => ({
          abs,
          tonner: tonner.value,
        })),
      };

      const toastId = toast.loading(editColorId ? 'Editing Color' : 'Creating Color');
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
        toast.error(`Failed to ${editColorId ? 'Edited' : 'Created'} color`, { id: toastId });
      }
    },
  });

  const uploadImage = (file) => {
    const storageRef = ref(storage);
    const imageRef = ref(storageRef, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgresspercent(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagePreview(downloadURL);
          setImgUrl(downloadURL);
        });
      },
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleChooseImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };
  const onTonnerAdd = () => {
    if (!abs) {
      toast.error('abs is required');
      return;
    }
    if (!tonner) {
      toast.error('Tonner is required');
      return;
    }
    if (stageTwo) {
      setTonnerExistInFirstStage(false);
      const exist = stageTwoTonner.find((t) => t.tonner.value === tonner.value);
      if (exist) {
        setTonnerExistInTwoStage(true);
        return;
      }
      setTonnerExistInTwoStage(false);
      setStageTwoTonner([
        ...stageTwoTonner,
        {
          tonner,
          abs,
          stage: '2',
        },
      ]);
    } else {
      const exist = stageOneTonner.find((t) => t.tonner.value === tonner.value);
      setTonnerExistInTwoStage(false);
      if (exist) {
        setTonnerExistInFirstStage(true);
        return;
      }
      setTonnerExistInFirstStage(false);
      setStageOneTonner([
        ...stageOneTonner,
        {
          tonner,
          abs,
          stage: '1',
        },
      ]);
    }
  };

  const handleSave = () => {
    const isError = stageOneTonner.length === 0 && stageTwoTonner.length === 0;
    setShowTonnerError(isError);
    formik.handleSubmit();
  };

  const onDelete = (stage, tonnerValue) => {
    if (stage === '1') {
      setStageOneTonner((prev) => prev.filter((t) => t.tonner.value !== tonnerValue));
    } else {
      setStageTwoTonner((prev) => prev.filter((t) => t.tonner.value !== tonnerValue));
    }
  };

  const getTonnerOption = (id) => {
    const tonner = tonnerOptions.find((t) => t.value === id);
    return tonner;
  };
  useEffect(() => {
    if (id) {
      const edit = colors.find((color) => color.id === id);
      if (edit) {
        // manufacturerName: '',

        formik.setFieldValue('colorCode', edit.colorCode);
        formik.setFieldValue('colorName', edit.colorName);
        formik.setFieldValue('variant', edit.variant);
        formik.setFieldValue('yearFrom', edit.yearFrom);
        formik.setFieldValue('yearTo', edit.yearTo);
        formik.setFieldValue('modelVersion', edit.modelVersion);
        if (edit.colorType) {
          const optionColorType = ctOptions.find((o) => o.value === edit.colorType);
          formik.setFieldValue('colorTypeName', optionColorType);
        }
        if(edit?.layer==2){
          setStageTwo(true)
        }

        const manufacturerOpt = manufacturersOptions.find(((mo) => mo.value === edit.manufacturer));

        formik.setFieldValue('manufacturerName', manufacturerOpt);

        setEditColorId(edit.id);
        const stageOneTonner = edit.stageOneTonner?.map(({ abs, tonner }) => ({
          abs,
          tonner: getTonnerOption(tonner),
        }));

        const stageTwoTonner = edit.stageTwoTonner?.map(({ abs, tonner }) => ({
          abs,
          tonner: getTonnerOption(tonner),
        }));

        setStageOneTonner(stageOneTonner);
        setStageTwoTonner(stageTwoTonner);
        setImagePreview(edit.imgUrl);
        setImgUrl(edit.imgUrl || '');

      } else {
        router.push('/Colors');
      }
    }

  }, [id]);

  return (
    <section id="add-color">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter px-3">Add-Color</h1>

        <div className="row p-3">
          <div className="p-4 bg-white">
            <div className="row d-flex align-items-center">
              <div className="col-4">
                <p className="mb-0">Manufacturer name</p>
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

              <div className="col-4 d-flex flex-column">
                <p className="mb-0">Color code</p>
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter Color code"
                  onChange={formik.handleChange('colorCode')}
                  onBlur={formik.handleBlur('colorCode')}
                  value={formik.values.colorCode}
                />
                {formik.touched.colorCode && formik.errors.colorCode ? (
                  <div className="text-danger">{formik.errors.colorCode}</div>
                ) : null}
              </div>

              <div className="col-4 d-flex flex-column">
                <p className="mb-0">Color Name</p>
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter Color Name"
                  onChange={formik.handleChange('colorName')}
                  onBlur={formik.handleBlur('colorName')}
                  value={formik.values.colorName}
                />
                {formik.touched.colorName && formik.errors.colorName ? (
                  <div className="text-danger">{formik.errors.colorName}</div>
                ) : null}
              </div>

              <div className="col-4 d-flex flex-column">
                <p className="mb-0">Variant</p>
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter Variant"
                  onChange={formik.handleChange('variant')}
                  onBlur={formik.handleBlur('variant')}
                  value={formik.values.variant}
                />
              </div>

              <div className="col-4 d-flex flex-column">
                <p className="mb-0">Year(from)</p>
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter Year(from)"
                  onChange={formik.handleChange('yearFrom')}
                  onBlur={formik.handleBlur('yearFrom')}
                  value={formik.values.yearFrom}
                />
                {formik.touched.yearFrom && formik.errors.yearFrom ? (
                  <div className="text-danger">{formik.errors.yearFrom}</div>
                ) : null}
              </div>

              <div className="col-4 d-flex flex-column">
                <p className="mb-0">Year(to)</p>
                <input
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter Year(to)"
                  onChange={formik.handleChange('yearTo')}
                  onBlur={formik.handleBlur('yearTo')}
                  value={formik.values.yearTo}
                />
                {formik.touched.yearTo && formik.errors.yearTo ? (
                  <div className="text-danger">{formik.errors.yearTo}</div>
                ) : null}
              </div>
              <div className="d-flex">
                <div className="col-4 d-flex flex-column me-3">
                  <p className="mb-0">Model version</p>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Enter model version"
                    onChange={formik.handleChange('modelVersion')}
                    onBlur={formik.handleBlur('modelVersion')}
                    value={formik.values.modelVersion}
                  />
                </div>

                <div className="col-4 me-3">
                  <p className="mb-0">Color type name</p>
                  <Select
                    options={ctOptions}
                    onChange={(selectedOption) => formik.setFieldValue('colorTypeName', selectedOption)}
                    value={formik.values.colorTypeName}
                  />
                  {formik.touched.colorTypeName &&
                  formik.errors.colorTypeName ? (
                    <div className="text-danger">
                      {formik.errors.colorTypeName.value}
                    </div>
                    ) : null}
                </div>

                <div className="col-3 d-flex flex-column">
                  <span>Drag and Drop Image Here </span>
                  <div>
                    <div
                      className="drag-drop-container dragBox"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={handleChooseImageClick}
                      style={{
                        height: '80px',
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />

                      {imagePreview ? (
                        <div className="image-preview">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            width="100%"
                            height="150px"
                          />
                        </div>
                      ) : (
                        <div>No image available</div>
                      )}
                    </div>
                  </div>

                  <div id="preview">
                    {!imgUrl && (
                      <div className="outerbar">
                        <div
                          className="innerbar"
                          style={{ width: `${progresspercent}%` }}
                        >
                          {progresspercent}
                          %
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-10 w-75 mx-auto">
            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
              <div className="col-2 d-flex flex-column justify-content-end">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="form-check-input"
                  />
                  <p className="m-0 ps-2">stage 1</p>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={stageTwo}
                    onChange={() => setStageTwo(!stageTwo)}
                    className="form-check-input"
                  />
                  <p className="m-0 ps-2">stage 2</p>
                </div>
              </div>

              <div className="col-4">
                <p className="mb-0">ADD Tonner</p>
                <Select
                  options={tonnerOptions}
                  value={tonner}
                  onChange={(value) => {
                    setTonnerExistInFirstStage(false);
                    setTonnerExistInTwoStage(false);
                    setTonner(value);
                  }}
                />
              </div>

              <div className="col-4">
                <p className="mb-0">ABS</p>
                <input
                  type="number"
                  className="form-control w-100"
                  placeholder="Enter ABS"
                  value={abs}
                  onChange={(e) => {
                    setAbs(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onTonnerAdd(); // Call onTonnerAdd function when Enter is pressed
                    }
                  }}
                />
              </div>
              <div style={{ transform: 'translateY(20px)' }}>
                <Button color="primary" onClick={onTonnerAdd}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          {showTonnerError && (
            <div className="text-danger d-flex align-items-center justify-content-center mt-3">
              Please add color tonner(s)
            </div>
          )}
        </div>
        <div className="d-flex  justify-content-between mt-4">
          <div className="me-5 w-50">
            <TonnerTable
              tonners={stageOneTonner}
              getTonnerColor={getTonnerColor}
              onDelete={onDelete}
            />
            {tonnerExistInFirstStage && (
              <div className="text-danger  mt-3">
                {tonner.label}
                {' '}
                tonner already exist
              </div>
            )}
          </div>
          {stageTwo && (
            <div className="w-50">
              <TonnerTable
                tonners={stageTwoTonner}
                getTonnerColor={getTonnerColor}
                onDelete={onDelete}
              />
              {tonnerExistInTwoStage && (
                <div className="text-danger  mt-3">
                  {tonner.label}
                  {' '}
                  tonner already exist
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 col-10 d-flex justify-content-end">
          <button type="submit" onClick={handleSave} className="btn btn-dark">
            Save
          </button>
          <Button className="ms-4" color="success" onClick={() => router.push('/Colors')}>Back</Button>
        </div>
      </div>
    </section>
  );
}

export default AddColorSection;
