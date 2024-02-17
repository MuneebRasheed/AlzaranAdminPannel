import {
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where,
} from 'firebase/firestore';
import { db } from '../firebase';

// eslint-disable-next-line import/prefer-default-export

export const getAllTonner = async () => {
  const tonnerCollection = collection(db, 'tonner');

  const querySnapshot = await getDocs(tonnerCollection);

  const tonners = [];
  querySnapshot.forEach((tempDoc) => {
    tonners.push({
      id: tempDoc.id,
      ...tempDoc.data(),
    });
  });

  return tonners;
};

export const create = async (values) => {
  const manufacturerQuery = query(collection(db, '/tonner'), where('tonner', '==', values.tonner));
  const manufacturerSnapshot = await getDocs(manufacturerQuery);

  if (!manufacturerSnapshot.empty) {
    // If a document with the provided name already exists, return it
    const manufacturerDoc = manufacturerSnapshot.docs[0];
    return { id: manufacturerDoc.id, ...manufacturerDoc.data(), isAlreadyExist: true };
  }

  const currentDate = new Date();
  let newId;
  const array = await getAllTonner();

  if (!array || array.length === 0) {
    newId = 0;
  } else {
    const maxIdToDisplay = Math.max(...array.map((obj) => obj.idToDisplay));
    newId = maxIdToDisplay + 1;
  }

  const data = {
    idToDisplay: newId,
    ...values,
    createdAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
    updatedAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
  };

  const docRef = await addDoc(collection(db, '/tonner'), data);
  return { id: docRef.id, ...data };
};

export const updateTonner = async (id, type) => {
  const currentDate = new Date();
  const data = {
    ...type,
    updatedAt: currentDate.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }),
  };

  const typeRef = doc(db, '/tonner', id);

  await updateDoc(typeRef, data);

  return { id, ...data };
};

export const deleteTonner = async (id) => {
  console.log("colors", id);
  const tonnerRef = doc(db, '/tonner', id);
  const tonerValue = id;

  try {
    
      const manufacturerQuery = query(collection(db, '/colors'), where("stageTonner", "array-contains", tonerValue ));
  const stageOneSnapshot = await getDocs(manufacturerQuery);
 
  const deletePromises = stageOneSnapshot.docs.map(async (doc) => {
    
    await deleteDoc(doc.ref);
   
  });
    

    await deleteDoc(tonnerRef);

window.location.reload();
    return id;
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return null;
  }
};
