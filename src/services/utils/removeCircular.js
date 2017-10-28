const dangerous = ['_version', '_context', '_solution'];

const omit = data => {
  const newData = Object.assign({}, data);
  dangerous.forEach(key => {
    delete newData[key];
  });
  return newData;
};

export default data => {
  if (typeof data === 'Array') {
    return { data: data.map(omit) };
  } else {
    return omit(data);
  }
};
