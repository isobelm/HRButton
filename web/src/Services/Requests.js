import axios from 'axios';

const API = axios.create({
    baseURL: 'https://hrbuttonbackend.azurewebsites.net/api/',
    timeout: 10000,
  });

export const getTotals = async (user) => {
    const result = await API.get(`getCounts`, {params: {user, type: "HRButton"}});
    return result.data;
};

export const getPress = async (user) => {
    const result = await API.get(`getPress`, {params: {user, type: "HRButton"}});
    return result.data;
};

export const getDailyCounts = async (user) => {
    const result = await API.get(`getDailyCounts`, {params: {user, type: "HRButton"}});
    return result.data;
};