import React, { useEffect, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ToastContainer } from "react-toastify";
import { sidebarAPI } from "./api/sidebarAPI";
import _ from "lodash";
import Tree from "./components/sidebarManagement/tree";
import SidebarMain from "./components/sidebar/SidebarMain";
import Header from "./components/header/Header";
import ScrollButton from "./components/scrollToTop/ScrollButton";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  const [treeData, setTreeData] = useState([]);
  const [treeDataParse, setTreeDataParse] = useState([]);
  const [rowInfoGenerate, setRowInfoGenerate] = useState([]);

  useEffect(() => {
    fetchSidebars();
  }, []);

  useEffect(() => {
    const parentArr = _.sortBy(
      treeData,
      (obj) => parseInt(obj.count),
      10
    ).filter((a) => a.parentId === "");
    const childArr = _.sortBy(
      treeData,
      (obj) => parseInt(obj.count),
      10
    ).filter((a) => a.parentId !== "");
    setTreeDataParse(parseData(parentArr, childArr));
  }, [treeData]);

  const fetchSidebars = async () => {
    try {
      const { data } = await sidebarAPI.getSidebars();
      setTreeData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const parseData = (dataParse, childArr) => {
    dataParse.forEach((parent) => {
      let childHaveChild = [];
      let childOnly = [];
      childArr.forEach((child) => {
        if (child.parentId == parent.id) {
          childHaveChild.push(child);
        } else childOnly.push(child);
      });
      parent.children = childHaveChild;
      if (parent.children.length > 0) {
        return parseData(parent.children, childOnly);
      }
    });
    return dataParse;
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-4 transition-primary">
        <div className="col-span-1">
          <ProSidebarProvider>
            <SidebarMain data={treeDataParse} fetchSidebars={fetchSidebars} />
          </ProSidebarProvider>
        </div>
        <div className="col-span-3">
          <Tree
            fetchSidebars={fetchSidebars}
            originalData={treeData}
            data={treeDataParse}
            rowInfoGenerate={rowInfoGenerate}
            setRowInfoGenerate={setRowInfoGenerate}
          />
        </div>
      </div>
      <ScrollButton />
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default App;
