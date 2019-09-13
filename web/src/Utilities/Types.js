export const Types = {
  Master: "Master",
  HR: "HR",
  GoofChold: "Goof Chold",
  MISTAKE: "MISTAKE",
  Yike: "Yike"
};

let typeMap = {};
for (let key in Types) {
  typeMap[key.toLowerCase()] = Types[key];
}

export const MapType = type => {
  let mappedType = typeMap[type];
  if (!mappedType) {
    mappedType = Types.Master;
  }
  return mappedType;
};
