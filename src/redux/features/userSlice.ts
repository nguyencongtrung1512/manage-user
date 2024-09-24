import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types/user";

const initialState: UserState = {
  users: [], // Danh sách user hiện tại (theo trang)
  filteredUsers: [], // Danh sách user khi có tìm kiếm
  searchQuery: "", // Query tìm kiếm hiện tại
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Cập nhật danh sách người dùng từ API
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      // Khi không có search query, filteredUsers cũng là danh sách users đầy đủ
      if (!state.searchQuery) {
        state.filteredUsers = action.payload;
      }
    },
    
    // Cập nhật search query và danh sách người dùng tìm kiếm
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filteredUsers = state.users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.last_name.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.email.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    
    // Cập nhật filteredUsers (khi cần)
    setFilteredUsers(state, action: PayloadAction<User[]>) {
      state.filteredUsers = action.payload;
    },
  },
});

export const { setUsers, setSearchQuery, setFilteredUsers } = userSlice.actions;
export default userSlice.reducer;
