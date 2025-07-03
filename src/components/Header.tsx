import React from "react";
import { Button, Menu } from "antd";

export default function Header(): JSX.Element {
  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="text-xl font-bold">YourLogo</div>
        <Menu mode="horizontal" className="hidden md:flex">
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="web">Web designs</Menu.Item>
          <Menu.Item key="mobile">Mobile designs</Menu.Item>
          <Menu.Item key="illustrations">Illustrations</Menu.Item>
        </Menu>
      </div>
      <div className="space-x-2">
        <Button>Log in</Button>
        <Button type="primary">Sign up</Button>
      </div>
    </div>
  );
}