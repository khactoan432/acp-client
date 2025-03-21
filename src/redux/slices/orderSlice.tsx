import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, putData, deleteData } from '../../axios';

// Define the type for a Order
interface Order {
  _id: string;
  code: string;
  type: string;
  method: string; 
  payment_status: string;
  createdAt: string;
  materialDetails: any;
  userDetails: any;
}

// Define the initial state
interface OrderState {
  adminOrders: Order[];
  userOrders: Order[];
  totalAdmin: number;
  totalUser: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  adminOrders: [],
  userOrders: [],
  totalAdmin: 0,
  totalUser: 0,
  loading: false,
  error: null,
};

// Thunks for CRUD operations
export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async ({page, limit}: {page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/admin/orders?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({page, limit}: {page: number, limit: number}, { rejectWithValue }) => {
    try {
      const response = await getData(`api/orders?page=${page}&limit=${limit}`, {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// export const createOrder = createAsyncThunk(
//   'orders/createOrder',
//   async (orderData: object, { rejectWithValue }) => {
//     try {
//       const response = await postData('api/admin/order', orderData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to create order');
//     }
//   }
// );

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (
    { orderId, updatedData }: { orderId: string; updatedData: object },
    { rejectWithValue }
  ) => {
    try {
      const response = await putData(`api/admin/order/${orderId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      await deleteData(`api/admin/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete order');
    }
  }
);

// Create the order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload.data;
        state.totalAdmin = action.payload.total;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.data;
        state.totalUser = action.payload.total;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Order
      // .addCase(createOrder.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(createOrder.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const createdOrders = action.payload.data;
      //   console.log(action.payload ,state.adminOrders, createdOrders, state.adminOrders.concat(createdOrders))

      //   state.adminOrders=state.adminOrders.concat(createdOrders);
      //   state.totalAdmin = state.totalAdmin + 1;
      // })
      // .addCase(createOrder.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.data;
        const index = state.adminOrders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) {
          state.adminOrders[index] = updatedOrder;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = state.adminOrders.filter((order) => order._id !== action.payload);
        state.totalAdmin = state.totalAdmin - 1;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
