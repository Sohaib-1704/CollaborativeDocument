import axios from "axios";

const API_URL = "http://localhost:5000";  

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("jwt_token", token);
  } else {
    localStorage.removeItem("jwt_token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("jwt_token");
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      return response;
    } catch (err) {
      throw err;
    }
  };
  
  export const signUp = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, password });
      return response;
    } catch (err) {
      throw err;
    }
  };

export const createDocument = async (documentData) => {
  try {
    const response = await axiosInstance.post("/documents", documentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await axiosInstance.delete(`/api/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getDocument = async (docId, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/documents/${docId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  export const saveDocument = async (docId, content, token) => {
    try {
      const response = await axios.put(`${API_URL}/api/documents/${docId}`, { content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  export const getDocumentVersions = async (docId, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/documents/${docId}/versions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };