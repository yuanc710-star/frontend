import React from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SignUpFormValues {
  email: string;
  password: string;
  terms: boolean;
  newsletter?: boolean;
}

const { Title, Text, Link } = Typography;
export default function SignUp(): JSX.Element {
    const [form] = Form.useForm<SignUpFormValues>();
    const onFinish = (values: SignUpFormValues) => {
        console.log('Form values:', values);
        // Here you would typically handle the form submission, e.g., send data to your backend
    };
    return (
        <div className = "min-h-screen bg-white">
            <Header />
            <div className = "flex flex-col md:flex-row max-w-6xl mx-auto p-6 md:p-12">
                {/* Left Side - Pic Section */}
                <div className="hidden md:block md:w-1/2 pr-8">
                    <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-300 to-orange-200 rounded-lg flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">[Image Placeholder]</span>
                    </div>
                </div>
                {/* Right Side - Form Section */}
                <div className="w-full md:w-1/2 max-w-md mx-auto;">
                    <Title level={2} className="mb-6">Sign Up</Title>
                    <div className="flex mb-4">
                        <Text type="secondary" className="text-base text-center">
                            Sign up for free to access any of our products
                        </Text>
                    </div>
                    <Form
                        form={form}
                        name="sign_up"
                        onFinish={onFinish}
                        initialValues={{ terms: false, newsletter: false }}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="terms"
                            valuePropName="checked"
                            rules={[{ required: true, message: 'You must accept the terms and conditions!' }]}
                        >
                            <Checkbox>
                                I agree to the <Link href="#">Terms and Conditions</Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item name="newsletter" valuePropName="checked">
                            <Checkbox>Subscribe to our newsletter</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Sign Up
                            </Button>
                        </Form.Item>

                        <Text className="text-center block">
                            Already have an account? <Link href="/login">Log in</Link>
                        </Text>
                    </Form>
                </div>

            </div>
        </div>
    );
}
