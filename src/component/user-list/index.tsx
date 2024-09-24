import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Modal, Form, Popconfirm, message } from "antd";
import { User } from "../../types/user";
import api from "../../config/axios";
import { RootState, AppDispatch } from "../../redux/store";
import { setSearchQuery, setUsers, setFilteredUsers } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import "./index.scss";
import Buttonn from "../../UI/button";

function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, filteredUsers, searchQuery } = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1); // Current page state
  const [pageSize] = useState(6); // Page size of 6 users per page
  const navigate = useNavigate();
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch users từ API với phân trang
  const fetchUsers = async (pageNumber: number) => {
    try {
      const response = await api.get(`users?page=${pageNumber}&per_page=${pageSize}`);
      const users = response.data.data;
      dispatch(setUsers(users)); // Cập nhật danh sách người dùng vào Redux
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchUsers(page); // Fetch người dùng theo trang khi không có query tìm kiếm
    }
  }, [page, searchQuery]);

  // Xử lý tìm kiếm người dùng
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    dispatch(setSearchQuery(query)); // Cập nhật query tìm kiếm trong Redux

    if (query) {
      // Fetch tất cả người dùng để tìm kiếm
      api.get(`users?per_page=1000`) // Giả định có thể fetch tất cả người dùng
        .then((response) => {
          const allUsers = response.data.data;
          const filtered = allUsers.filter(
            (user) =>
              user.first_name.toLowerCase().includes(query) ||
              user.last_name.toLowerCase().includes(query) ||
              user.email.toLowerCase().includes(query)
          );
          dispatch(setFilteredUsers(filtered)); // Cập nhật danh sách người dùng đã lọc
          setPage(1); // Reset về trang 1 sau khi tìm kiếm
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch(setFilteredUsers([])); // Clear danh sách người dùng đã lọc
      fetchUsers(page); // Refetch người dùng khi không có query
    }
  };

  // Hiển thị chi tiết người dùng
  const handleShowDetails = (userId: number) => {
    navigate(`/detail/${userId}`);
  };

  // Mở modal để thêm người dùng mới
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    form.setFieldsValue({
      name: user.first_name + " " + user.last_name,
      job: user.job || "N/A",
    });
    setVisible(true);
  };

  // Xử lý submit form cho cả chế độ thêm và sửa
  const handleSubmit = async (values: any) => {
    if (isEditMode && selectedUser) {
      try {
        const response = await api.patch(`users/${selectedUser.id}`, {
          name: values.name,
          job: values.job,
        });

        dispatch(
          setUsers(
            users.map((user) =>
              user.id === selectedUser.id
                ? {
                  ...user,
                  first_name: values.name.split(" ")[0],
                  last_name: values.name.split(" ")[1],
                  job: values.job,
                }
                : user
            )
          )
        );
        setVisible(false);
        message.success("User updated successfully");
      } catch (err) {
        console.log(err);
        message.error("Failed to update user");
      }
    } else {
      try {
        const response = await api.post("users", {
          name: values.name,
          job: values.job,
        });

        dispatch(setUsers([...users, response.data])); // Thêm người dùng mới vào Redux
        setVisible(false);
        message.success("User added successfully");
      } catch (err) {
        console.log(err);
        message.error("Failed to add user");
      }
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await api.delete(`users/${userId}`);
      fetchUsers(page); // Refetch sau khi xóa người dùng
      message.success("User deleted successfully");
    } catch (err) {
      console.log(err);
      message.error("Failed to delete user");
    }
  };

  const handleHideModal = () => {
    setVisible(false);
  };

  const handleOk = () => {
    form.submit();
  };

  // Pagination controls
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Hiển thị người dùng theo phân trang hoặc kết quả tìm kiếm
  const usersToDisplay = searchQuery
    ? filteredUsers.slice((page - 1) * pageSize, page * pageSize) // Phân trang kết quả tìm kiếm
    : users; // Toàn bộ người dùng của trang hiện tại

  const totalUsers = searchQuery ? filteredUsers.length : users.length;

  return (
    <div className="user-list">
      <Buttonn variant="default" onClick={handleAddUser}>
        Add User
      </Buttonn>

      <Input.Search
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 20, marginRight: 30 }}
      />

      {/* Hiển thị số lượng người dùng khi tìm kiếm */}
      {searchQuery && (
        <div style={{ marginBottom: 20 }}>
          {filteredUsers.length} user(s) found
        </div>
      )}

      <div className="user-table">
        {usersToDisplay.length > 0 ? (
          <ul>
            {usersToDisplay.map((user) => (
              <li key={user.id}>
                <div>
                  <div className="user-info">
                    <strong>
                      {user.first_name} {user.last_name}
                    </strong>{" "}
                    - {user.email} - {user.job}
                  </div>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{ width: 50, cursor: "pointer", marginLeft: 10 }}
                    onClick={() => handleShowDetails(user.id)}
                  />
                </div>
                <div>
                  <Buttonn variant="primary" onClick={() => handleEdit(user)}>
                    Edit
                  </Buttonn>
                  <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => handleDelete(user.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Buttonn variant="danger" onClick={() => handleDelete(user.id)}>Delete</Buttonn>
                  </Popconfirm>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No users found.</div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="pagination-controls">
        <Buttonn variant="primary" onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </Buttonn>
        <span>
          Page {page} 
        </span>
        <Buttonn variant="primary" onClick={handleNextPage} disabled={users.length === 0}>
          Next
        </Buttonn>
      </div>

      {/* Modal cho việc thêm hoặc sửa người dùng */}
      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleHideModal}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the user's name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Job"
            name="job"
            rules={[{ required: true, message: "Please input the user's job!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserList;
