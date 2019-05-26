import { ENV } from '../../utils/model';

wx.cloud.init({
  env: ENV
});

const db = wx.cloud.database({
  env: ENV
});

export const getData = {
  collectionDoc: async (collection, doc) => {
    return await db.collection(collection).doc(doc);
  },
  collectionWhere: async (collection, where = {}) => {
    return await db
      .collection(collection)
      .where(where)
      .get();
  },
  collectionOrderBy: async (collection, order = []) => {
    return await db
      .collection(collection)
      .orderBy(...order)
      .get();
  },
  collectionLimit: async (collection, limit) => {
    return await db
      .collection(collection)
      .limit(limit)
      .get();
  },
  collectionSkip: async (collection, skip) => {
    return await db
      .collection(collection)
      .skip(skip)
      .get();
  },
  collectionField: async (collection, field) => {
    return await db
      .collection(collection)
      .field(field)
      .get();
  },
  doc: async (collection, doc) => {
    return await db
      .collection(collection)
      .doc(doc)
      .get();
  }
};
export const updateData = {
  doc: async (collection, doc, data) => {
    return await db
      .collection(collection)
      .doc(doc)
      .update({
        data
      });
  }
};
export const addData = {
  collection: async (collection, data = {}) => {
    return await db.collection(collection).add({
      data
    });
  }
};
export const removeData = {
  doc: async (collection, doc) => {
    return await db
      .collection(collection)
      .doc(doc)
      .remove();
  }
};
export const setData = {
  doc: async (collection, doc, data) => {
    return await db
      .collection(collection)
      .doc(doc)
      .set({
        data
      });
  }
};
export const countData = {
  collection: async (collection, where) => {
    return await db
      .collection(collection)
      .where(where)
      .count();
  }
};
