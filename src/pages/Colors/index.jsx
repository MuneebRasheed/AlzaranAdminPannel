/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import toast from 'react-hot-toast';
// eslint-disable-next-line import/no-unresolved, import/extensions, import/no-extraneous-dependencies
import readXlsxFile from 'read-excel-file';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as XLSX from 'xlsx/xlsx.mjs';

import PaginatedTable from '@/components/PaginatedTable';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { filter, resetSearch } from '@/store/colors';
// eslint-disable-next-line import/no-unresolved, import/extensions
import {
  addColor, deleteAllColor, deleteColor,
} from '@/store/colors-actions';
import ColorModal from '@/components/ColorModal';
import DeleteModal from '@/components/DeleteModal';
import {
  create,
} from '../../../services/tonner';

import {
  create as createManufatcurer,
} from '../../../services/manufactuer';

import { addStaticTonner } from '@/store/tonner';
import { addStaticManufacturer } from '@/store/manufacture';
import ImageClipboardComponent from '@/components/ImageClipboardComponent';
import ExportModal from '@/components/ExportModal';
import ErrorModal from '@/components/ErrorModal';
import UploadModal from '@/components/UploadModal';
import UploadSuccesModal from '@/components/UploadSuccesModal';

const headers = [
  { key: 'colorShade', label: 'Color Shade' },
  { label: 'Manufacturer', key: 'manufactureName' },
  { label: 'Color type', key: 'colorsTypesName' },
  { label: 'Color Code', key: 'colorCode' },
  { label: 'Layer', key: 'layer' },

  { label: 'Variant', key: 'variant' },
  { label: 'Color Name', key: 'colorName' },
  { label: 'Year', key: 'year' },
  { label: 'Version', key: 'modelVersion' },
  { label: 'Created On', key: 'createdAt' },
  { label: 'Modified On', key: 'updatedAt' },
];

export default function Colors() {
  const router = useRouter();
  const manufacturersOptions = useSelector(
    (state) => state.manufacture.mtSearchOptions,
  );

  const tonners = useSelector(
    (state) => state.tonner.tonners,
  );
  const colorType= useSelector((state) => state.colorType.colorTypes)

  const [manufacturer, setManufacturer] = useState(null);
  const [colorName, setColorName] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [modal, setModal] = useState(false);
  const [viewColor, setViewColor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const [uploadProgress, setUploadProgress] = useState(0);
const [uploadErrors, setUploadErrors] = useState([]);

  const {
    colors,
    searching,
    filteredColors,
  } =
    useSelector((state) => state.colors);

  const handleCreate = () => {
    router.push('/CreateColor');
  };

  const getManufactureName = (id) => {
    const temp = manufacturersOptions.find((t) => t.value === id);
    return temp?.label || 'unknown';
  };

  const transformColors = useCallback(
    (col) => col.map((color) => ({
      ...color,
      colorShade:

        <ImageClipboardComponent color={color} />,
      manufactureName: getManufactureName(color.manufacturer),
      colorCode: color.colorCode,
      createdAt: color.createdAt,
      updatedAt: color.updatedAt,
      year: `${color.yearFrom} - ${color.yearTo}`,
    }
    )),
    [colors, manufacturersOptions],
  );

  const transformedColors = useMemo(() => transformColors(colors), [colors, manufacturersOptions]);

  const filteredTransformedColors = useMemo(() => transformColors(filteredColors), [filteredColors, manufacturersOptions]);

  const onSearch = () => {
    dispatch(filter({ manufacturer: manufacturer?.value || null, colorName, colorCode }));
  };

  const onRefresh = () => {
    setColorName('');
    setColorCode('');
    setManufacturer(null);
    dispatch(resetSearch());
  };

  const onDelete = async (value) => {
    const toastId = toast.loading('Deleting Color');
    try {
      await dispatch(deleteColor(value.id));
      toast.success('Deleted !', {
        id: toastId,
      });
    } catch (error) {
      toast.error('Failed to Delete Color', {
        id: toastId,
      });
    }
  };

  const onView = (color) => {
    setModal(true);
    setViewColor(color);
  };

  const toggle = () => {
    setModal(false);
    setViewColor(null);
  };
  function extractColorInfo(fileContent) {
    const colorInfo = {imgUrl:"",layer:1};

    // Check and assign yearFrom
    const matchYearFrom = fileContent.match(/Year\s+:\s+(\d+)/);
    colorInfo.yearFrom = matchYearFrom && matchYearFrom[1] ? matchYearFrom[1] : '';

    // Check and assign yearTo
    const matchYearTo = fileContent.match(/Year\s+:\s+\d+\/(\d+)/);
    colorInfo.yearTo = matchYearTo && matchYearTo[1] ? matchYearTo[1] : '';

    // Extract and assign other information using regular expressions
    const matchManufacturerName = fileContent.match(/Brand\s+:\s+\w+\s+(\w+)/);
    colorInfo.manufacturerName = matchManufacturerName && matchManufacturerName[1] ? matchManufacturerName[1] : '';

    const matchColorName = fileContent.match(/(Color|Colour) name\s+:\s+(.+)/i);
    colorInfo.colorName = matchColorName && matchColorName[2] ? matchColorName[2] : '';

    const matchColorCode = fileContent.match(/Colou?r code\s+:\s+(\w+)/);
    colorInfo.colorCode = matchColorCode && matchColorCode[1] ? matchColorCode[1] : '';

    const matchVariant = fileContent.match(/Variant\s+:\s*(.*?)\s+(?=Colou?r name)/);
    colorInfo.variant = matchVariant && matchVariant[1] ? matchVariant[1].trim() : '';

    const matchMutationDate = fileContent.match(/Mutation date\s*:\s*(.*)/);
    colorInfo.modelVersion = matchMutationDate && matchMutationDate[1] ? matchMutationDate[1].trim() : '';
    const matchQuality = fileContent.match(/Quality\s+:\s+([\w\s-]+)/);
    const qualityValue = matchQuality && matchQuality[1] ? matchQuality[1].trim() : '';

    if (qualityValue.includes('500')) {
      colorInfo.colorsTypesName = 'BASE';
      colorInfo.colorType = 'BASE';
    } else if (qualityValue.includes('2000')) {
      colorInfo.colorsTypesName = 'CRYL';
      colorInfo.colorType = 'CRYL';
    } else {
      colorInfo.colorType = ''; // or any default value if the quality doesn't match known values
    }

    // Extract mixing colors
    const mixingColors = [];
    const regexMixingColors = /(\w+)\s+(\d+\.\d+)/g;
    let matchMixingColor = regexMixingColors.exec(fileContent);
    while (matchMixingColor !== null) {
      // Check if the line starts with "Total"
      if (matchMixingColor[1].toLowerCase() !== 'total') {
        const mixColor = {
          code: matchMixingColor[1],
          weight: parseFloat(matchMixingColor[2]),
        };
        mixingColors.push(mixColor);
      }
      matchMixingColor = regexMixingColors.exec(fileContent);
    }

    colorInfo.mixingColors = mixingColors;

    return colorInfo;
  }

  const getTonnerId = async (code) => {
    const tonner = tonners.find((t) => t.tonner === code);
    if (tonner) {
      return tonner.id;
    }

    const { isAlreadyExist, ...rest } = await create({
      weightPerKg: '1000',
      weightPerLiter: '1000',
      weightPercentage: '1000',
      tonnerCodeColor: '#000',
      tonner: code,
    });

    if (!isAlreadyExist) {
      dispatch(addStaticTonner(rest));
    }

    return rest.id;
  };

  const getStageValue = async (mixingColors) => {

    const stageOneTonner = [];
    const stageTwoToner = [];
    const stageTonner=[]

    // eslint-disable-next-line no-restricted-syntax
    for (const iterator of mixingColors) {
      // eslint-disable-next-line no-await-in-loop
      const tonner = await getTonnerId(iterator.code);
      const abs = iterator.weight;
      stageTonner.push(tonner)
      stageOneTonner.push({
        abs,
        tonner,
      });
    }

    return { stageOneTonner, stageTwoToner ,stageTonner};
  };


  const getManufacturer = async (manufacturerName) => {
   
    const temp = manufacturersOptions.find((t) => t.label === manufacturerName);
    if (temp) {
      return temp?.value;
    }

    const { isAlreadyExist, ...rest } = await createManufatcurer(manufacturerName);
    if (!isAlreadyExist) {
      dispatch(addStaticManufacturer(rest));
    }

    return rest.id;
  };

  const getColorType = async (type) => {
    console.log("colors",colorType)
    const temp = colorType.find((t) => t.name == type);
    if (temp) {
      return temp?.id;
    }else{
      return ""
    }

    

    
  };

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
    const nonCombineColors = colors.filter((color) => color.isCombineColor !== true);

    const obj = nonCombineColors.find(
      ({
        // eslint-disable-next-line no-shadow
        colorCode, yearFrom, yearTo, stageOneTonner, stageTwoToner,
      }) => (
        body.colorCode === colorCode &&
        yearFrom === body.yearFrom &&
        yearTo === body.yearTo &&
        areArraysOfObjectsEqual(stageOneTonner, body.stageOneTonner) &&
        areArraysOfObjectsEqual(stageTwoToner, body.stageTwoToner)
      ),
    );
    return obj;
  };

 
 
 
  const uploadFiles = async (color, index, totalFiles) => {
    let totalFileCompleted=false
    try {
      const { mixingColors, manufacturerName,colorType, ...rest } = color;
      const stageTonner = await getStageValue(mixingColors);
      const manufacturerId = await getManufacturer(manufacturerName);
      const manufacturerIdcolorType = await getColorType(colorType);
      // getColorType
      
      const object = { ...rest, ...stageTonner, manufacturer: manufacturerId ,colorType:manufacturerIdcolorType};
      if (alreadyExist(object)) {
        setUploadErrors((prevErrors) => [
          ...prevErrors,
          `${color.colorCode} with same tonners already exist`,
        ]);
      } else {
        totalFileCompleted=true
        await dispatch(addColor(object));
      }
      
      // Update progress only if totalFiles is available
      if (totalFiles) {
        const progress = ((index + 1) / totalFiles) * 100;
        setUploadProgress(progress);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw the error to be caught in the processFilesSequentially function
    }
    return totalFileCompleted
  };



  const processFilesSequentially = async (files) => {
    setShowUploadModal(true)
    setUploadProgress(0); // Reset progress
    setUploadErrors([]); // Reset errors
    const totalFiles = files.length;
    const uploadedFiles = []; // To keep track of successfully uploaded files
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      await new Promise((resolve, reject) => {
        reader.onload = async function (e) {
          const fileContent = e.target.result;
          const colorInfo = extractColorInfo(fileContent);
  
          try {
       let fileStatus=     await uploadFiles(colorInfo, i, totalFiles); // Pass totalFiles
       
       if(fileStatus){
        uploadedFiles.push(file); // Track successfully uploaded files
       }
           
            resolve();
          } catch (error) {
            reject(error);
          }
        };
  
        reader.readAsText(file);
      }).catch((error) => {
        console.error('Error processing file:', error);
      });
    }
    setShowUploadModal(false);
  console.log("uploadedFiles.length ",uploadedFiles.length )
  console.log("uploadedFiles.totalFiles ",totalFiles )
    // Check if there are any upload errors
    if (uploadedFiles.length !== totalFiles) {
      setShowErrorModal(true);
    } 
    
    if(uploadedFiles.length == totalFiles){
      // If no errors, show success modal
      setShowUploadSuccessModal(true);
    }
  };
  async function handleFileUpload(event) {

    const files = event.target.files;
    // Check if files are uploaded
    if (!files || files.length === 0) {
      toast.error('No files uploaded.');
      return;
    }

    // Handle each uploaded file
    // Assuming extractColorInfo is a function defined elsewhere in your code
    await processFilesSequentially(files);

    fileInputRef.current.value = null;
    event.target.value = '';
  }

  const handleDelete = async () => {
    await dispatch(deleteAllColor());
    setShowDeleteModal(false);
  };

  const handleDeleteAll = () => {
  
    setShowDeleteModal(true);
  };
  const getTonnerName = (tonner) => {
    const temp = tonners.find((t) => t.id === tonner);
    return temp?.tonner || 'unknown';
  };

  const onExport = (options) => {
    const tempHeader = [
      { key: 'isDeleted', label: 'isDeleted' }, // always zero
      { label: 'Manufacturer', key: 'manufactureName' },
      { label: 'Color type', key: 'colorsTypesName' },
      { label: 'Color code', key: 'colorCode' },
      { label: 'Color name', key: 'colorName' },
      { label: 'Variant', key: 'variant' },
      { label: 'Layer', key: 'layer' },
   
      { label: 'Year from', key: 'yearFrom' },
      { label: 'Year to', key: 'yearTo' },
    ];

    const colorsArray = [];
    let data = searching ? filteredTransformedColors : transformedColors;

    data = data.filter((d) => options.includes(d.manufacturer));

    data.forEach((element) => {
      if (element.isCombineColor) return;
      const { stageOneTonner, stageTwoTonner = [], ...rest } = element;
      const obj = { ...rest };

      const combinedArray = stageOneTonner.concat(stageTwoTonner);

      combinedArray.forEach(({ tonner }, index) => {
        const keyToCheck = `tonner${index + 1}`;
        if (!tempHeader.some((header) => header.key === keyToCheck)) {
          tempHeader.push({
            label: `Tonner ${index + 1}`,
            key: keyToCheck,
          });
        }
        obj[`tonner${index + 1}`] = getTonnerName(tonner);
      });

      combinedArray.forEach(({ abs }, index) => {
        const keyToCheck = `abs${index + 1}`;

        if (!tempHeader.some((header) => header.key === keyToCheck)) {
          tempHeader.push({
            label: `Abs ${index + 1}`,
            key: keyToCheck,
          });
        }

        obj[`abs${index + 1}`] = abs;
      });

      colorsArray.push(obj);
    });

    const csvContent = [
      tempHeader.map((header) => header.label).join(','), // Creating header row
      ...colorsArray.map((color) => [
        0, // Hardcoding 0 for isDeleted field
        ...tempHeader.slice(1).map((header) => color[header.key] || ''), // Mapping other fields except isDeleted
      ].join(',')),
    ].join('\n');

    // const blob = new Blob([csvContent], { type: 'text/csv' });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement('a');
    // link.setAttribute('href', url);
    // link.setAttribute('download', 'export.csv');
    // document.body.appendChild(link);
    // link.click();

    // // Clean up
    // URL.revokeObjectURL(url);
    // document.body.removeChild(link);

    const csvArray = csvContent.split('\n').map((row) => row.split(','));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(csvArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.xlsx');
    document.body.appendChild(link);
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleExcelFileUpload = async (event) => {
    const file = event.target.files[0];

    readXlsxFile(file)
      .then(async (rows) => {
        // Process the parsed data as needed

        // eslint-disable-next-line no-shadow
        const [headers, ...dataRows] = rows;

        // Find the indexes of the required headers
        const headerIndexes = {
          
         
          Manufacturer: headers.indexOf('Manufacturer'),
          ColorType:headers.indexOf('Color type'),
          ColorCode: headers.indexOf('Color code'),
          Layer: headers.indexOf('Layer'),
          ColorName: headers.indexOf('Color name'),
          Variant: headers.indexOf('Variant'),
          ColorTypeName: headers.indexOf('Color type name'),
          YearFrom: headers.indexOf('Year from'),
          YearTo: headers.indexOf('Year to'),
          Version: headers.indexOf('Version'),
        };

        // Find indexes of Tonner and Abs columns
        const tonnerIndexes = [];
        const absIndexes = [];
        headers.forEach((header, index) => {
          if (header.startsWith('Tonner')) {
            tonnerIndexes.push(index);
          } else if (header.startsWith('Abs')) {
            absIndexes.push(index);
          }
        });

        // Iterate over data rows and create objects
        const objects = dataRows.map((row) => {
          const obj = {
            manufacturerName: row[headerIndexes.Manufacturer] || '',
            colorCode: row[headerIndexes.ColorCode] || '',
            colorName: row[headerIndexes.ColorName] || '',
            layer: row[headerIndexes.Layer] || '',
            colorsTypesName:row[headerIndexes.ColorType]|| '',
            variant: row[headerIndexes.Variant] || '',
            ColorTypeName: row[headerIndexes.ColorTypeName] || '',
            yearFrom: row[headerIndexes.YearFrom] || '',
            yearTo: row[headerIndexes.YearTo] || '',
            mixingColors: [],
            modelVersion: row[headerIndexes.Version] || '',
          };

          // Extract Tonner and corresponding Abs values
          tonnerIndexes.forEach((tonnerIndex, tonnerIdx) => {
            const tonner = row[tonnerIndex];
            if (tonner) {
              const absIndex = absIndexes[tonnerIdx];
              if (absIndex !== undefined && row[absIndex]) {
                obj.mixingColors.push({
                  code: tonner,
                  weight: row[absIndex],
                });
              }
            }
          });

          return obj;
        });

        // Process the extracted objects as needed
        // eslint-disable-next-line no-restricted-syntax
        for (const obj of objects) {
          // eslint-disable-next-line no-await-in-loop
          await uploadFiles(obj); // Assuming uploadFiles is an async function
        }
      })
      .catch((error) => {
        toast.error('Error reading Excel file');
        console.error('Error reading Excel file:', error);
      });

    event.target.value = '';
  };
  return (
    <section id="colors" className="section">
      <div className="container-fluid px-0 py-3">
        <h1 className="fw-lighter p-3">Colors</h1>
        <div className="row p-3">
          <div className="col-2">
            <button type="button" className="btn btn-dark sw" onClick={handleCreate}>
              Create new
            </button>
          </div>
          <div className="col-10 d-flex justify-content-end gap-2">
            <ExportModal onExport={onExport} />
            {/* <button type="button" className="btn btn-dark" onClick={onExport}>Export color</button> */}
            <div>
              <label htmlFor="excelFile" className="btn btn-dark">
                Import Excel
              </label>
              <input
                type="file"
                id="excelFile"
                accept=".xls,.xlsx"
                style={{ display: 'none' }}
                onChange={handleExcelFileUpload}
              />
            </div>
            <div>
              <label className="btn btn-dark">
                Upload txt File
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".txt" multiple />
              </label>
            </div>
            <button type="button" className="btn btn-danger" onClick={handleDeleteAll}>Delete all</button>
          </div>
        </div>
        <div className="p-4 bg-white">
          <p className="fs-5">Search Color</p>
          <div className="row d-flex align-items-center">
            <div className="col-4 d-flex flex-column">
              <p className="mb-0">Color code</p>
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search color by code"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
              />
            </div>
            <div className="col-4 d-flex flex-column">
              <p className="mb-0">Color Name</p>
              <input
                type="text"
                className="form-control w-100"
                placeholder="Select color by name"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
            </div>
            <div className="col-4">
              <p className="mb-0">Manufacturer</p>
              <div className="dropdown">
                <Select
                  options={manufacturersOptions}
                  value={manufacturer}
                  onChange={(value) => setManufacturer(value)}
                />
              </div>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-end pt-4">
              <button type="button" className="btn btn-dark" onClick={onSearch}>Search</button>
              <button type="button" className="btn btn-danger ms-2" onClick={onRefresh}>Refresh</button>
            </div>
          </div>
        </div>
      </div>
      
      
      <PaginatedTable
        data={searching ? filteredTransformedColors : transformedColors}
        headers={headers}
        showActions
        isViewAction
        onView={onView}
        onDelete={onDelete}
      />
      <ColorModal
        isOpen={modal}
        toggle={toggle}
        color={viewColor}
        data={transformedColors}
      />
      <DeleteModal
        show={showDeleteModal}
        handleDelete={handleDelete}
        handleClose={() => setShowDeleteModal(false)}
      />

<ErrorModal
  show={showErrorModal}
  errors={uploadErrors}
  handleClose={() => setShowErrorModal(false)}
/>


<UploadModal
  show={showUploadModal}
  uploadProgress={uploadProgress}
  handleClose={() => setShowUploadModal(false)}
/>
<UploadSuccesModal
  show={showUploadSuccessModal}
  uploadProgress={uploadProgress}
  handleClose={() => setShowUploadSuccessModal(false)}
/>
    </section>
  );
}
