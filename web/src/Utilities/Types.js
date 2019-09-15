export const Types = {
  Master: "Master",
  HR: "HR",
  "Goof Chold": "Goof Chold",
  Yike: "Yike",
  Dumb: "Dumb",
  MISTAKE: "MISTAKE",
};

let typeMap = {};
for (let key in Types) {
  typeMap[key.toLowerCase()] = Types[key];
}

export const MapType = type => {
  let mappedType = typeMap[type.toLowerCase()];
  if (!mappedType) {
    mappedType = Types.Master;
  }
  return mappedType;
};
