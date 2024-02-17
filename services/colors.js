import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

// eslint-disable-next-line import/prefer-default-export
export const create = async (values) => {
  const currentDate = new Date();
  const data = {
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
  const docRef = await addDoc(collection(db, '/colors'), data);
  return { id: docRef.id, ...data };
};

export const get = async () => {
  const typesCollection = collection(db, 'colors');

  const querySnapshot = await getDocs(typesCollection);

  const colors = [];
  querySnapshot.forEach((tempDoc) => {
    colors.push({
      id: tempDoc.id,
      ...tempDoc.data(),
    });
  });

  return colors;
};

export const del = async (id) => {
  const typeRef = doc(db, '/colors', id);

  await deleteDoc(typeRef);

  return id;
};

export const deleteAllDocuments = async (colors) => {
  const deletePromises = colors.map(async ({ id }) => {
    const docRef = doc(db, 'colors', id);
    await deleteDoc(docRef);
  });

  await Promise.all(deletePromises);
};

export const updateColor = async (id, type) => {
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

  const typeRef = doc(db, '/colors', id);

  await updateDoc(typeRef, data);

  return { id, ...data };
};
