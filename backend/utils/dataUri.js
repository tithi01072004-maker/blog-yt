import DatauriParser from 'datauri/parser.js'; // include .js
import path from 'path';

const parser = new DatauriParser();

const getDataUri = (file) => {
  if (!file) return null;
  const extName = path.extname(file.originalname); // no .toString() needed
  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
