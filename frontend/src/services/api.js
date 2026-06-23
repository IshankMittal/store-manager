//This will connect React to Flask.
/*
==========================================
AXIOS API CONFIGURATION

Purpose:
Centralized API connection to Flask backend.

Backend:
http://127.0.0.1:5000

Usage:
api.get(...)
api.post(...)
api.put(...)
api.delete(...)
==========================================
*/

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000"
});

export default api;