import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./index.css";
import { ProSidebarProvider } from "react-pro-sidebar";
import Tree from "./components/sidebarManagement/tree";
import SidebarMain from "./components/sidebar/SidebarMain";
import Header from "./components/header/Header";
import { sidebarAPI } from "./api/sidebarAPI";
import { BrowserRouter } from "react-router-dom";
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollButton from "./components/scrollToTop/ScrollButton";

const App = () => {
  const [treeData, setTreeData] = useState([]);
  const [treeDataParse, setTreeDataParse] = useState([]);
  const fetchSidebars = async () => {
    try {
      const { data } = await sidebarAPI.getSidebars();
      setTreeData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSidebars();
  }, []);

  useEffect(() => {
    const parentArr = _.sortBy(treeData, ["count"]).filter(
      (a) => a.parentId === null
    );
    const childArr = _.sortBy(treeData, ["count"]).filter(
      (a) => a.parentId !== null
    );
    setTreeDataParse(parseData(parentArr, childArr));
  }, [treeData]);

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
    <BrowserRouter>
      <div>
        <Header />
        <div className="grid grid-cols-4 gap-2 transition-primary">
          <div className="col-span-1">
            <ProSidebarProvider>
              <SidebarMain data={treeDataParse} fetchSidebars={fetchSidebars} />
            </ProSidebarProvider>
          </div>
          <div className="col-span-3">
            <Tree fetchSidebars={fetchSidebars} data={treeDataParse} />
          </div>
        </div>
        <ScrollButton />
        <ToastContainer autoClose={2000} />
      </div>
    </BrowserRouter>
  );
};

render(<App />, document.getElementById("root"));
