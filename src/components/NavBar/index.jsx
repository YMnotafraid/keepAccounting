import React, { useState } from "react";
import PropTypes from "prop-types";
import { TabBar } from "zarm";
import { useNavigate } from "react-router-dom";
import s from "./style.module.less";
import CustomIcon from "../CustomIcon";
const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState("/");
  const navigateTo = useNavigate();

  const changeTab = (path) => {
    setActiveKey(path);
    navigateTo(path);
  };

  return (
    <TabBar
      visible={showNav}
      className={s.tab}
      activeKey={activeKey}
      onChange={changeTab}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan"></CustomIcon>}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="tongji"></CustomIcon>}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode"></CustomIcon>}
      />
    </TabBar>
  );
};

NavBar.propTypes = {
  showNav: PropTypes.bool,
};

export default NavBar;
