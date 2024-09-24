import { Form, Input, Button, message } from "antd";
import api from "../../config/axios";
import { useForm } from "antd/es/form/Form";

function AddUser() {
  const [form] = useForm();

  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post("users", {
        name: values.name,
        job: values.job,
      });

      // Log response to verify successful creation
      console.log('User added:', response.data);

      // Clear form fields after successful submission
      form.resetFields();
      message.success('User added successfully');
    } catch (err) {
      console.log(err);
      message.error('Failed to add user');
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the user name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Job"
          name="job"
          rules={[{ required: true, message: 'Please input the job title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button type="primary" htmlType="submit">
            Add User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddUser;
