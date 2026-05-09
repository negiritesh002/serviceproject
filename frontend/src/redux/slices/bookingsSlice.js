import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
  }
);

export const fetchCustomerBookings = createAsyncThunk(
  'bookings/fetchCustomer',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getCustomerBookings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchVendorBookings = createAsyncThunk(
  'bookings/fetchVendor',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getVendorBookings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking not found');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.updateStatus(id, { status, notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.cancel(id, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    pagination: null,
    isLoading: false,
    createLoading: false,
    updateLoading: false,
    error: null
  },
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    }
  },
  extraReducers: (builder) => {
    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createLoading = false;
        state.currentBooking = action.payload.booking;
        toast.success('Booking created successfully!');
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createLoading = false;
        toast.error(action.payload);
      });

    // Fetch Customer Bookings
    builder
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Vendor Bookings
    builder
      .addCase(fetchVendorBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVendorBookings.rejected, (state, action) => {
        state.isLoading = false;
      });

    // Fetch Booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.booking;
      })
      .addCase(fetchBookingById.rejected, (state) => {
        state.isLoading = false;
      });

    // Update Status
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload.booking;
        state.bookings = state.bookings.map(b =>
          b._id === updated._id ? updated : b
        );
        state.currentBooking = updated;
        toast.success(action.payload.message);
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.updateLoading = false;
        toast.error(action.payload);
      });

    // Cancel Booking
    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const updated = action.payload.booking;
        state.bookings = state.bookings.map(b =>
          b._id === updated._id ? updated : b
        );
        toast.success('Booking cancelled successfully');
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        toast.error(action.payload);
      });
  }
});

export const { clearCurrentBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;