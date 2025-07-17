// src/redux/slices/centerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  center: {
    name: "",
    location: "",
    address: "",
    email: "",
    phone: "",
  },
  admin: {
    name: "",
    qualification: "",
    designation: "",
    kmcNo: "",
    hospitalName: "",
    centerCode: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    userType: "centeradmin",
  },
  loading: false,
  success: false,
  error: null,
};

// Async thunk to submit form
export const createCenterWithAdmin = createAsyncThunk(
  "center/createCenterWithAdmin",
  async ({ center, admin }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/superadmin/centers",
        { center, admin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const centerSlice = createSlice({
  name: "center",
  initialState,
  reducers: {
    setCenterField: (state, action) => {
      const { name, value } = action.payload;
      state.center[name] = value;
    },
    setAdminField: (state, action) => {
      const { name, value } = action.payload;
      state.admin[name] = value;
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCenterWithAdmin.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createCenterWithAdmin.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCenterWithAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCenterField, setAdminField, resetForm } = centerSlice.actions;
export default centerSlice.reducer;
