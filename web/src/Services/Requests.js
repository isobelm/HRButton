import axios from "axios";

const API = axios.create({
  baseURL: "https://hrbuttonbackend.azurewebsites.net/api/",
  timeout: 10000
});

export const getTotals = async (user, type) => {
  const result = await API.get(`getCounts`, { params: { user, type } });
  return result.data;
};

export const getPress = async (user, type) => {
  const result = await API.get(`getPress`, { params: { user, type } });
  return result.data;
};

export const getDailyCounts = async (user, type) => {
  const result = await API.get(`getDailyCounts`, { params: { user, type } });
  return result.data;
};
