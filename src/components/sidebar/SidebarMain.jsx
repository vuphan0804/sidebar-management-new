import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { FiHome, FiMenu, FiPackage, FiChevronsRight } from "react-icons/fi";
import Marquee from "react-fast-marquee";
import "./SidebarMain.scss";

const SidebarMain = ({ data }) => {
  const { collapseSidebar } = useProSidebar();
  const [treeData, setTreeData] = useState([]);
  const [start, setStart] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setTreeData(data);
  }, [data]);

  useEffect(() => {
    window.addEventListener("resize", getSize);
    if (width < 1000) {
      setCollapse(true);
    } else {
      setCollapse(false);
    }
    return () => {
      window.removeEventListener("resize", getSize);
    };
  }, [window.innerWidth]);

  const getSize = () => {
    setWidth(window.innerWidth);
  };

  const handleStartMarquee = () => {
    setStart(true);
  };

  const handleStopMarquee = () => {
    setStart(false);
  };

  const renderSidebar = (treeData) => {
    return treeData?.map((parent, index) => {
      if (parent.children && parent.children?.length > 0) {
        return (
          <SubMenu icon={<FiChevronsRight />} label={parent.name} key={index}>
            {renderSidebar(parent.children)}
          </SubMenu>
        );
      } else
        return (
          <MenuItem
            icon={<FiPackage />}
            routerLink={<Link to={`/${parent.name}`} />}
            key={index}
          >
            {parent.name}
          </MenuItem>
        );
    });
  };
  return (
    <div className="fixed flex mt-15 h-full">
      <Sidebar width="300px" collapsedWidth="80px" defaultCollapsed={collapse}>
        <div className="text-xl font-medium text-center mt-28">Sidebar</div>
        <div className="mx-8 left-10 z-10">
          <button onClick={() => collapseSidebar()}>
            <FiMenu />
          </button>
        </div>

        <Menu className="transition-primary">
          <MenuItem
            className="visited:bg-red-400 home-test"
            routerLink={<Link to="/" />}
            icon={<FiHome />}
          >
            Home
          </MenuItem>
          {renderSidebar(treeData)}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMain;
