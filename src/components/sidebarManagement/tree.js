import React, { useState, useEffect } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll,
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import _ from "lodash";
import Loading from "../loading/Loading";
import HeaderSidebarManagement from "./headerSidebarManagement/HeaderSidebarManagement";
import SidebarFormDelete from "./sidebarForm/SidebarFormDelete.jsx";
import SidebarFormIcon from "./sidebarForm/SidebarFormIcon";
import FormUpdateNode from "./sidebarForm/FormUpdateNode";
import FormAddNodeChild from "./sidebarForm/FormAddNodeChild";
import SidebarPopupInfo from "./modal/SidebarPopupInfo";
import { toast } from "react-toastify";
import { useRef } from "react";

const Tree = ({ data, fetchSidebars, originalData }) => {
  const [searchFocusIndex, setSearchFocusIndex] = useState(0),
    [searchFoundCount, setSearchFoundCount] = useState(null),
    [treeData, setTreeData] = useState([]),
    [selectedSidebar, setSelectedSidebar] = useState(), // selected sidebar id to be updated
    [treeDataUpdate, setTreeDataUpdate] = useState([]),
    [treeDataUpdateAll, setTreeDataUpdateAll] = useState([]),
    [treeDataUpdateNode, setTreeDataUpdateNode] = useState([]),
    [treeDataUpdateIcon, setTreeDataUpdateIcon] = useState([]),
    [treeDataAddNode, setTreeDataAddNode] = useState([]),
    [treeDataAddNodeChild, setTreeDataAddNodeChild] = useState([]),
    [treeDataRemoveNode, setTreeDataRemoveNode] = useState([]),
    [rowInfoDelete, setRowInfoDelete] = useState([]),
    [selectedNodeParent, setSelectedNodeParent] = useState([]),
    [selectedNodeUpdateIcon, setSelectedNodeUpdateIcon] = useState([]),
    [popupInfo, setPopupInfo] = useState([]),
    [searchString, setSearchString] = useState(""),
    [treeDataPrev, setTreeDataPrev] = useState([treeData]),
    [rowInfoGenerate, setRowInfoGenerate] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isOpenFormDelete, setIsOpenFormDelete] = useState(false),
    [isOpenPopupInfo, setIsOpenPopupInfo] = useState(false),
    [isOpenFormIcon, setIsOpenFormIcon] = useState(false),
    [isOpenFormUpdate, setIsOpenFormUpdate] = useState(false),
    [isOpenFormAddNodeChild, setIsOpenFormAddNodeChild] = useState(false),
    [isChangeTree, setIsChangeTree] = useState(true);
  const listRowinfo = useRef();
  const getNodeKey = ({ treeIndex }) => treeIndex;

  // useEffect(() => {
  //   setTreeData(data);
  // }, [data]);

  useEffect(() => {
    const parentArr = _.sortBy(
      originalData,
      (obj) => parseInt(obj.count),
      10
    ).filter((a) => a.parentId === "");
    const childArr = _.sortBy(
      originalData,
      (obj) => parseInt(obj.count),
      10
    ).filter((a) => a.parentId !== "");
    setTreeData(parseData(parentArr, childArr));
  }, [originalData]);

  useEffect(() => {
    setTreeDataPrev(data);
  }, [data]);

  useEffect(() => {
    if (compareArrays(treeDataPrev, treeData)) {
      setIsChangeTree(false);
    } else {
      setIsChangeTree(true);
    }
  }, [treeData]);

  useEffect(() => {
    if (!treeData || treeData.length) {
      setIsLoading(false);
    } else if (treeData.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else setIsLoading(true);
  }, [treeData]);

  const compareArrays = (a, b) => {
    return JSON.stringify(a) != JSON.stringify(b);
  };

  const parseData = (dataParse, childArr) => {
    dataParse.forEach((parent) => {
      let childHaveChild = [];
      let childOnly = [];
      parent.name = parent.isName ? parent.name : parent.title;
      parent.title = (
        <div className="flex items-center">
          <div>{parent.name}</div>
          <div className="ml-10">
            {parent.isAddNodeChild ? (
              <button
                id="addChildEl"
                className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                label="Add Child"
                onClick={(event) => handleOpenFormAddNodeChild(parent.id)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            ) : null}

            {parent.isRemoveNode ? (
              <button
                id="deleteEl"
                className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                label="Delete"
                onClick={(event) => handleOpenFormDelete(parent.id)}
              >
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            ) : null}

            {parent.isInfoNode ? (
              <button
                className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                label="Alert"
                onClick={(event) => handleOpenPopupInfo(parent.id)}
              >
                <i className="fa-sharp fa-solid fa-circle-info"></i>
              </button>
            ) : null}
          </div>
        </div>
      );
      parent.isName = true;
      childArr.forEach((child) => {
        child.name = child.title;
        if (child.parentId == parent.id) {
          child.title = (
            <div className="flex items-center">
              <div>{child.name}</div>
              <div className="ml-10">
                {child.isAddNodeChild ? (
                  <button
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={(event) => handleOpenFormAddNodeChild(parent.id)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {child.isRemoveNode ? (
                  <button
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={(event) => handleOpenFormDelete(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {child.isInfoNode ? (
                  <button
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={(event) => handleOpenPopupInfo(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          );
          child.isName = true;
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
  useEffect(() => {
    listRowinfo.current = [];
  }, []);

  useEffect(() => {
    handleRenderIcon();
  }, [listRowinfo]);

  const deParseData = (treeData, data) => {
    treeData?.forEach((parent, index) => {
      let x = {
        title: parent.name,
        expanded: parent.expanded,
        parentId: parent.parentId,
        id: parent.id,
        icon: parent.icon,
        count: index + 1,
      };
      data.push(x);
      if (parent.children || parent.children.length > 0) {
        deParseData(parent.children, data);
      }
    });
    return data;
  };

  // const createNode = () => {
  //   const value = inputEl.current.value;

  //   if (value === "") {
  //     inputEl.current.focus();
  //     return;
  //   }
  //   let addNodes = [];
  //   addNodes.push({
  //     parentId: "",
  //     title: value,
  //     expanded: true,
  //     icon: "menu.png",
  //   });
  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: "",
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       parentId: "",
  //       title: value,
  //       expanded: true,
  //       icon: "menu.png",
  //     },
  //   });
  //   setTreeDataAddNode(addNodes);
  //   setTreeData(newTree.treeData);
  //   // handleOpenForm();
  //   inputEl.current.value = "";
  // };

  // const selectedAddNodeChild = (rowInfo) => {
  //   let { node, path } = rowInfo;
  //   const value = inputChildEl.current.value;
  //   setSelectedNodeParent(rowInfo);

  //   inputChildEl.current.focus();
  // };

  // const addNodeChild = () => {
  //   const value = inputChildEl.current.value;

  //   let addNodeChild = [];

  //   addNodeChild.push({
  //     parentId: selectedNodeParent.node.id,
  //     title: value,
  //     expanded: true,
  //     icon: "menu.png",
  //   });
  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: selectedNodeParent.path[selectedNodeParent.path.length - 1],
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       parentId: selectedNodeParent.node.id,
  //       title: value,
  //     },
  //   });
  //   setTreeDataAddNodeChild(addNodeChild);
  //   setTreeData(newTree.treeData);

  //   inputChildEl.current.value = "";
  //   // inputEls.current[treeIndex].current.value = "";
  // };

  // const addNodeSibling = (rowInfo) => {
  //   let { path } = rowInfo;

  //   const value = inputEl.current.value;
  //   // const value = inputEls.current[treeIndex].current.value;

  //   if (value === "") {
  //     inputEl.current.focus();
  //     // inputEls.current[treeIndex].current.focus();
  //     return;
  //   }

  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: path[path.length - 2],
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       title: value,
  //     },
  //   });

  //   setTreeData(newTree.treeData);
  //   handleOpenForm();

  //   inputEl.current.value = "";
  //   // inputEls.current[treeIndex].current.value = "";
  // };

  // const updateNode = (rowInfo, formValue) => {
  //   if (!rowInfo) return;
  //   const { node, path } = rowInfo;
  //   setSelectedSidebar(node);
  //   // updateInputEl.current.focus();

  //   // // const value = updateInputEl.current.value;

  //   let newNode = {
  //     id: formValue.id,
  //     title: formValue.name,
  //     expanded: formValue.expanded,
  //     parentId: formValue.parentId,
  //     count: formValue.count,
  //     children: formValue.children,
  //     icon: formValue.icon,
  //   };
  //   let newTree = changeNodeAtPath({
  //     treeData,
  //     path,
  //     getNodeKey,
  //     newNode: {
  //       id: formValue.id,
  //       title: formValue.name,
  //       expanded: formValue.expanded,
  //       parentId: formValue.parentId,
  //       count: formValue.count,
  //       children: formValue.children,
  //       icon: formValue.icon,
  //     },
  //   });
  //   setTreeDataUpdateNode(newNode);
  //   setTreeData(newTree);
  //   handleCloseFormUpdate();
  // };

  // const updateIcon = (rowInfo, newIcon) => {
  //   if (!rowInfo) return;

  //   const { node, path } = rowInfo;
  //   setSelectedNodeUpdateIcon(node);

  //   let newNode = {
  //     id: node.id,
  //     title: node.title,
  //     expanded: node.expanded,
  //     parentId: node.parentId,
  //     count: node.count,
  //     children: node.children,
  //     icon: newIcon,
  //   };
  //   let newTree = changeNodeAtPath({
  //     treeData,
  //     path,
  //     getNodeKey,
  //     newNode: {
  //       id: node.id,
  //       title: node.title,
  //       expanded: node.expanded,
  //       parentId: node.parentId,
  //       count: node.count,
  //       children: node.children,
  //       icon: newIcon,
  //     },
  //   });
  //   setTreeDataUpdateIcon(newNode);

  //   setTreeData(newTree);
  //   handleCloseFormIcon();
  // };

  const removeNode = () => {
    let arrRemoveNode = [];
    const path = rowInfoDelete ? rowInfoDelete.path : null;
    arrRemoveNode.push(rowInfoDelete.node);
    const nodeRemove = deParseData(arrRemoveNode, []);
    setTreeDataRemoveNode(nodeRemove);
    // setTreeData(
    //   removeNodeAtPath({
    //     treeData,
    //     path,
    //     getNodeKey,
    //   })
    // );
    handleCloseFormDelete();
  };

  const updateTreeData = (treeData) => {
    setTreeData(treeData);
  };

  const expand = (expanded) => {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    );
  };

  const expandAll = () => {
    expand(true);
  };

  const collapseAll = () => {
    expand(false);
  };

  // const alertNodeInfo = ({ node, path, treeIndex }) => {
  //   const objectString = Object.keys(node)
  //     .map((k) => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
  //     .join(",\n   ");

  //   global.alert(
  //     "Info passed to the icon and button generators:\n\n" +
  //       `node: {\n   ${objectString}\n},\n` +
  //       `path: [${path.join(", ")}],\n` +
  //       `treeIndex: ${treeIndex}`
  //   );
  // };

  const selectPrevMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1
    );
  };

  const selectNextMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
    );
  };

  const showToastMessageSuccess = (msg = "Success") => {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageError = (msg = "Error") => {
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleRenderIcon = (rowInfo) => {
    if (rowInfo) {
      const moveHandle = document.getElementsByClassName("rst__moveHandle");
      if (moveHandle[rowInfo.treeIndex]) {
        moveHandle[
          rowInfo.treeIndex
        ].style.background = `#d9d9d9  url(${rowInfo.node.icon}) no-repeat center`;

        moveHandle[rowInfo.treeIndex].style.backgroundSize = `32px 32px`;
      }
    }
  };

  const handleCatchRowInfoGenerate = (rowInfo) => {
    handleRenderIcon(rowInfo);
    // setRowInfoGenerate(rowInfo);
  };

  const handleOpenFormUpdate = (rowInfo) => {
    setIsOpenFormUpdate(true);
    setSelectedSidebar(rowInfo);
  };

  const handleCloseFormUpdate = () => {
    setIsOpenFormUpdate(false);
  };

  const handleOpenFormDelete = (id) => {
    let rowInfo = listRowinfo.current.find((x) => x.id === id);
    setRowInfoDelete(rowInfo.value);
    setIsOpenFormDelete(true);
  };

  const handleCloseFormDelete = () => {
    setIsOpenFormDelete(false);
  };

  const handleOpenPopupInfo = (id) => {
    let rowInfo = listRowinfo.current.find((x) => x.id === id);

    setPopupInfo(rowInfo.value);
    setIsOpenPopupInfo(true);
  };

  const handleClosePopupInfo = () => {
    setIsOpenPopupInfo(false);
  };

  const handleOpenFormIcon = (rowInfo) => {
    setIsOpenFormIcon(true);
    setSelectedNodeUpdateIcon(rowInfo);
  };

  const handleCloseFormIcon = () => {
    setIsOpenFormIcon(false);
  };

  const handleOpenFormAddNodeChild = (id) => {
    let rowInfo = listRowinfo.current.find((x) => x.id === id);
    setSelectedNodeParent(rowInfo.value);
    setIsOpenFormAddNodeChild(true);
  };

  const handleCloseFormAddNodeChild = () => {
    setIsOpenFormAddNodeChild(false);
  };

  return (
    <div className="lg:ml-16 md:ml-10">
      <HeaderSidebarManagement
        expandAll={expandAll}
        collapseAll={collapseAll}
        searchString={searchString}
        setSearchString={setSearchString}
        searchFoundCount={searchFoundCount}
        selectNextMatch={selectNextMatch}
        selectPrevMatch={selectPrevMatch}
        searchFocusIndex={searchFocusIndex}
        selectedSidebar={selectedSidebar}
        fetchSidebars={fetchSidebars}
        treeDataUpdate={treeDataUpdate}
        treeDataUpdateAll={treeDataUpdateAll}
        treeDataUpdateNode={treeDataUpdateNode}
        treeDataRemoveNode={treeDataRemoveNode}
        treeDataAddNode={treeDataAddNode}
        treeDataAddNodeChild={treeDataAddNodeChild}
        selectedNodeParent={selectedNodeParent}
        setTreeDataUpdate={setTreeDataUpdate}
        isChangeTree={isChangeTree}
        deParseData={deParseData}
      />
      <div
        style={{ height: "100vh", position: "relative", marginLeft: "20px" }}
      >
        {!isLoading ? (
          <SortableTree
            className="text-center mx-auto"
            treeData={treeData}
            onMoveNode={(treeData) => {
              setTreeDataUpdateAll(treeData.treeData);
              let treeUpdateArr = [...treeDataUpdate];
              let node = treeData.node;
              node.parentId = treeData.nextParentNode
                ? treeData.nextParentNode.id
                : "";
              treeUpdateArr.push(node);
              setTreeDataUpdate(treeUpdateArr);
            }}
            onChange={(treeData) => {
              updateTreeData(treeData);
            }}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            isVirtualized={true}
            searchFinishCallback={(matches) => {
              setSearchFoundCount(matches.length);
              setSearchFocusIndex(
                matches.length > 0 ? searchFocusIndex % matches.length : 0
              );
            }}
            canDrag={({ node }) => !node.dragDisabled}
            onDragStateChanged={(node) => {}}
            generateNodeProps={(rowInfo) => {
              handleCatchRowInfoGenerate(rowInfo);
              if (rowInfo.node.expanded === true) {
                handleCatchRowInfoGenerate(rowInfo);
              }
              const data = listRowinfo.current;
              const obj = {
                id: rowInfo.node.id,
                value: rowInfo,
              };
              data.push(obj);
              listRowinfo.current = data;

              return {
                buttons: [
                  <div className="text-sm">
                    {/* <button
                      id="addChildEl"
                      className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Add Child"
                      onClick={(event) => handleOpenFormAddNodeChild(rowInfo)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button> */}

                    <button
                      id="updateEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Update"
                      onClick={(event) => handleOpenFormUpdate(rowInfo)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>

                    {/* <button
                      id="updateIconEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Update Icon"
                      onClick={(event) => handleOpenFormIcon(rowInfo)}
                    >
                      <i className="fa-solid fa-file-pen"></i>
                    </button> */}

                    {/* <button
                      id="deleteEl"
                      className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                      label="Delete"
                      onClick={(event) => handleOpenFormDelete(rowInfo)}
                      // onClick={(event) => removeNode(rowInfo)}
                    >
                      <i className="fa-sharp fa-solid fa-trash"></i>
                    </button>

                    <button
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Alert"
                      onClick={(event) => handleOpenPopupInfo(rowInfo)}
                    >
                      <i className="fa-sharp fa-solid fa-circle-info"></i>
                    </button> */}
                  </div>,
                ],
                style: {
                  height: "45px",
                },
              };
            }}
          />
        ) : (
          <Loading />
        )}
      </div>
      <FormAddNodeChild
        isOpenFormAddNodeChild={isOpenFormAddNodeChild}
        handleCloseFormAddNodeChild={handleCloseFormAddNodeChild}
        selectedNodeParent={selectedNodeParent}
        treeDataAddNodeChild={treeDataAddNodeChild}
        fetchSidebars={fetchSidebars}
        showToastMessageSuccess={showToastMessageSuccess}
        showToastMessageError={showToastMessageError}
      />
      <FormUpdateNode
        isOpenFormUpdate={isOpenFormUpdate}
        handleCloseFormUpdate={handleCloseFormUpdate}
        selectedSidebar={selectedSidebar}
        treeDataUpdateNode={treeDataUpdateNode}
        showToastMessageSuccess={showToastMessageSuccess}
        showToastMessageError={showToastMessageError}
        fetchSidebars={fetchSidebars}
        treeData={treeData}
        deParseData={deParseData}
      />
      <SidebarFormIcon
        isOpenFormIcon={isOpenFormIcon}
        handleCloseFormIcon={handleCloseFormIcon}
        selectedNodeUpdateIcon={selectedNodeUpdateIcon}
        treeDataUpdateIcon={treeDataUpdateIcon}
        fetchSidebars={fetchSidebars}
      />
      <SidebarFormDelete
        removeNode={removeNode}
        rowInfoDelete={rowInfoDelete}
        onCloseFormDelete={handleCloseFormDelete}
        isOpenFormDelete={isOpenFormDelete}
      />
      <SidebarPopupInfo
        treeDataUpdateNode={treeDataUpdateNode}
        isOpenPopupInfo={isOpenPopupInfo}
        handleClosePopupInfo={handleClosePopupInfo}
        popupInfo={popupInfo}
      />
    </div>
  );
};

export default Tree;
