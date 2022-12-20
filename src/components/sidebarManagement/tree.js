import React, { useState, useEffect, useRef } from "react";
import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import _ from "lodash";
import Loading from "../loading/Loading";
import HeaderSidebarManagement from "./headerSidebarManagement/HeaderSidebarManagement";
import SidebarFormDelete from "./modal/SidebarPopupDelete.jsx";
import SidebarFormIcon from "./sidebarForm/SidebarFormIcon";
import FormUpdateNode from "./sidebarForm/FormUpdateNode";
import FormAddNodeChild from "./sidebarForm/FormAddNodeChild";
import SidebarPopupInfo from "./modal/SidebarPopupInfo";
import { toast } from "react-toastify";

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
    [treeDataPrev, setTreeDataPrev] = useState([treeData]),
    [searchInput, setSearchInput] = useState(""),
    [searchString, setSearchString] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [searchListFocus, setSearchListFocus] = useState([]);
  const [treeDataSearchFocus, setTreeDataSearchFocus] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("searchNode");

  const [isOpenFormDelete, setIsOpenFormDelete] = useState(false),
    [isLoading, setIsLoading] = useState(true),
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

  // Icon
  useEffect(() => {
    if (
      compareArrays(
        treeDataPrevCloneWithoutExpanded,
        treeDataCloneWithoutExpanded
      )
    ) {
      setIsChangeTree(false);
    } else {
      setIsChangeTree(true);
    }
    const moveHandle = document.getElementsByClassName("rst__moveHandle");
    for (let index = 0; index < moveHandle.length; index++) {
      let temp =
        moveHandle[index].parentElement.getElementsByClassName("nodeflag");
      const nodeFlagId = [].slice
        .call(temp[0].classList)
        .find((x) => x.startsWith("nodeid"))
        .replace("nodeid", "");
      moveHandle[index].style.background = `#d9d9d9  url(${
        originalData.find((x) => x.id == nodeFlagId).icon
      }) no-repeat center`;
      moveHandle[index].style.backgroundSize = `32px 32px`;
    }
  }, [treeData]);

  // Loading
  useEffect(() => {
    if (!treeData || treeData.length) {
      setIsLoading(false);
    } else if (treeData.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else setIsLoading(true);
    // }, []);
  }, [treeData]);

  useEffect(() => {
    listRowinfo.current = [];
  }, []);

  // Save active

  const parseTreeDataWithoutExpand = (treeData) => {
    return treeData.map((e) => {
      delete e.expanded;
      if (e.children && e.children.length > 0) {
        e.children = parseTreeDataWithoutExpand(e.children);
        return e;
      }
      return e;
    });
  };

  // Compare handle save
  let treeDataPrevCloneWithoutExpanded = parseTreeDataWithoutExpand(
    _.cloneDeep(treeDataPrev)
  );

  let treeDataCloneWithoutExpanded = parseTreeDataWithoutExpand(
    _.cloneDeep(treeData)
  );

  const compareArrays = (a, b) => {
    return JSON.stringify(a) !== JSON.stringify(b);
  };

  const parseData = (dataParse, childArr) => {
    dataParse.forEach((parent) => {
      let childHaveChild = [];
      let childOnly = [];
      parent.name = parent.name ? parent.name : parent.title;

      parent.title = (
        <div className="flex items-center justify-between">
          <div className="whitespace-nowrap">{parent.name}</div>
          <div className="ml-10 text-sm">
            {parent.isAddNodeChild ? (
              <button
                type="button"
                id="addChildEl"
                className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                label="Add Child"
                onClick={() => handleOpenFormAddNodeChild(parent.id)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            ) : null}

            {parent.isRemoveNode ? (
              <button
                type="button"
                id="deleteEl"
                className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                label="Delete"
                onClick={() => handleOpenFormDelete(parent.id)}
              >
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            ) : null}

            {parent.isInfoNode ? (
              <button
                type="button"
                className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                label="Alert"
                onClick={() => handleOpenPopupInfo(parent.id)}
              >
                <i className="fa-sharp fa-solid fa-circle-info"></i>
              </button>
            ) : null}
          </div>
        </div>
      );
      childArr.forEach((child) => {
        child.name = child.name ? child.name : child.title;
        if (child.parentId == parent.id) {
          child.title = (
            <div className="flex items-center justify-between">
              <div>{child.name}</div>
              <div className="ml-10 text-sm">
                {child.isAddNodeChild ? (
                  <button
                    type="button"
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={() => handleOpenFormAddNodeChild(parent.id)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {child.isRemoveNode ? (
                  <button
                    type="button"
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={() => handleOpenFormDelete(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {child.isInfoNode ? (
                  <button
                    type="button"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={() => handleOpenPopupInfo(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          );
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

  const parseDataFocus = (dataParse, childArr) => {
    dataParse.forEach((parent) => {
      let childHaveChild = [];
      let childOnly = [];
      parent.name = parent.name ? parent.name : parent.title;
      // const isSearchFocus = searchListFocus.includes(parent.id);
      parent.title =
        currentSearch === "searchFocus" &&
        searchInput !== "" &&
        parent.name.toLowerCase().search(searchInput.toLowerCase()) >= 0 ? (
          <div className="flex items-center justify-between">
            <div className="whitespace-nowrap text-red-500">{parent.name}</div>
            <div className="ml-10 text-sm">
              {parent.isAddNodeChild ? (
                <button
                  type="button"
                  id="addChildEl"
                  className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                  label="Add Child"
                  onClick={() => handleOpenFormAddNodeChild(parent.id)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              ) : null}

              {parent.isRemoveNode ? (
                <button
                  type="button"
                  id="deleteEl"
                  className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                  label="Delete"
                  onClick={() => handleOpenFormDelete(parent.id)}
                >
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              ) : null}

              {parent.isInfoNode ? (
                <button
                  type="button"
                  className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                  label="Alert"
                  onClick={() => handleOpenPopupInfo(parent.id)}
                >
                  <i className="fa-sharp fa-solid fa-circle-info"></i>
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="whitespace-nowrap">{parent.name}</div>
            <div className="ml-10 text-sm">
              {parent.isAddNodeChild ? (
                <button
                  type="button"
                  id="addChildEl"
                  className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                  label="Add Child"
                  onClick={() => handleOpenFormAddNodeChild(parent.id)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              ) : null}

              {parent.isRemoveNode ? (
                <button
                  type="button"
                  id="deleteEl"
                  className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                  label="Delete"
                  onClick={() => handleOpenFormDelete(parent.id)}
                >
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              ) : null}

              {parent.isInfoNode ? (
                <button
                  type="button"
                  className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                  label="Alert"
                  onClick={() => handleOpenPopupInfo(parent.id)}
                >
                  <i className="fa-sharp fa-solid fa-circle-info"></i>
                </button>
              ) : null}
            </div>
          </div>
        );
      childArr.forEach((child) => {
        child.name = child.name ? child.name : child.title;
        const isSearchParentFocus = searchListFocus.includes(child.id);
        if (child.parentId == parent.id) {
          child.title = isSearchParentFocus ? (
            <div className="flex items-center justify-between">
              <div className="whitespace-nowrap bg-red-500">{child.name}</div>
              <div className="ml-10 text-sm">
                {child.isAddNodeChild ? (
                  <button
                    type="button"
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={() => handleOpenFormAddNodeChild(parent.id)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {child.isRemoveNode ? (
                  <button
                    type="button"
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={() => handleOpenFormDelete(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {child.isInfoNode ? (
                  <button
                    type="button"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={() => handleOpenPopupInfo(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="whitespace-nowrap">{child.name}</div>
              <div className="ml-10 text-sm">
                {child.isAddNodeChild ? (
                  <button
                    type="button"
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={() => handleOpenFormAddNodeChild(parent.id)}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {child.isRemoveNode ? (
                  <button
                    type="button"
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={() => handleOpenFormDelete(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {child.isInfoNode ? (
                  <button
                    type="button"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={() => handleOpenPopupInfo(parent.id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          );
          childHaveChild.push(child);
        } else childOnly.push(child);
      });
      parent.children = childHaveChild;
      if (parent.children.length > 0) {
        return parseDataFocus(parent.children, childOnly);
      }
    });
    return dataParse;
  };

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

  // Search node
  const treeDataClone = _.cloneDeep(treeData);

  const searchTree = (treeData, matchingName, dataNew) => {
    for (let index = 0; index < treeData.length; index++) {
      if (treeData[index].children.length > 0) {
        treeData[index].children = searchTree(
          treeData[index].children,
          matchingName,
          []
        );
      } // if (treeData[index].children.length > 0) dataNew.push(treeData[index]);
      if (
        treeData[index].children.length > 0 ||
        treeData[index].name.toLowerCase().search(matchingName.toLowerCase()) >=
          0
      ) {
        if (
          treeData[index].children.length > 0 &&
          treeData[index].name
            .toLowerCase()
            .search(matchingName.toLowerCase()) < 0
        ) {
          treeData[index].title = (
            <div className="flex items-center justify-between">
              <div className="whitespace-nowrap">{treeData[index].name}</div>
              <div className="ml-10 text-sm">
                {treeData[index].isAddNodeChild ? (
                  <button
                    type="button"
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={() =>
                      handleOpenFormAddNodeChild(treeData[index].id)
                    }
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {treeData[index].isRemoveNode ? (
                  <button
                    type="button"
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={() => handleOpenFormDelete(treeData[index].id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {treeData[index].isInfoNode ? (
                  <button
                    type="button"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={() => handleOpenPopupInfo(treeData[index].id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          );
        } else
          treeData[index].title = (
            <div className="flex items-center justify-between">
              <div className="whitespace-nowrap bg-red-100">
                {treeData[index].name}
              </div>
              <div className="ml-10 text-sm">
                {treeData[index].isAddNodeChild ? (
                  <button
                    type="button"
                    id="addChildEl"
                    className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Add Child"
                    onClick={() =>
                      handleOpenFormAddNodeChild(treeData[index].id)
                    }
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : null}

                {treeData[index].isRemoveNode ? (
                  <button
                    type="button"
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={() => handleOpenFormDelete(treeData[index].id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                ) : null}

                {treeData[index].isInfoNode ? (
                  <button
                    type="button"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={() => handleOpenPopupInfo(treeData[index].id)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                ) : null}
              </div>
            </div>
          );

        dataNew.push(treeData[index]);
      }
    }
    return dataNew;
  };

  // useEffect(() => {
  //   if (searchInput) {
  //     setTreeDataSearchNode(
  //       searchTree([...(treeDataClone ?? [])], searchInput, [])
  //     );
  //   }
  // }, [searchInput]);

  // const getNodeFocus = (treeData, matchingName, dataNew) => {
  //   for (let index = 0; index < treeData?.length; index++) {
  //     if (
  //       treeData[index].name.toLowerCase().search(matchingName.toLowerCase()) >=
  //       0
  //     ) {
  //       dataNew.push(treeData[index].id);
  //     }
  //     if (treeData[index].children.length > 0) {
  //       dataNew.push(
  //         ...getNodeFocus(treeData[index].children, matchingName, [])
  //       );
  //     }
  //   }
  //   return dataNew;
  // };

  // useEffect(() => {
  //   if (searchInput) {
  //     setSearchListFocus(getNodeFocus(treeDataClone, searchInput, []));
  //   }
  // }, [searchInput, currentSearch]);

  const removeNode = () => {
    let arrRemoveNode = [];
    arrRemoveNode.push(rowInfoDelete.node);
    const nodeRemove = deParseData(arrRemoveNode, []);
    setTreeDataRemoveNode(nodeRemove);
    handleCloseFormDelete();
  };

  const updateTreeData = (treeData) => {
    setTreeData(treeData);
    console.log("708");
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

  const handleOpenFormAddNodeChild = (id) => {
    let rowInfo = listRowinfo.current.find((x) => x.id === id);
    setSelectedNodeParent(rowInfo.value);
    setIsOpenFormAddNodeChild(true);
  };

  const handleCloseFormAddNodeChild = () => {
    setIsOpenFormAddNodeChild(false);
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

  console.log("searchInput", searchInput);

  useEffect(() => {
    if (searchInput) {
      if (currentSearch === "searchFocus") {
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
        console.log("715 focus");
        setSearchList(parseDataFocus(parentArr, childArr));
      }
      if (currentSearch === "searchNode") {
        console.log("718 node");
        setSearchList(searchTree([...(treeDataClone ?? [])], searchInput, []));
      }
    }
  }, [searchInput, currentSearch]);

  console.log("treeDataSearchFocus", treeDataSearchFocus);

  return (
    <div className="">
      <HeaderSidebarManagement
        expandAll={expandAll}
        collapseAll={collapseAll}
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
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setCurrentSearch={setCurrentSearch}
        currentSearch={currentSearch}
      />
      <div className="h-[100vh] relative mx-auto bg-red-100">
        {!isLoading ? (
          <SortableTree
            className="text-center mx-auto"
            // treeData={treeData}
            treeData={searchInput ? searchList : treeData}
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
              const data = listRowinfo.current;
              const obj = {
                id: rowInfo.node.id,
                value: rowInfo,
              };
              data.push(obj);
              listRowinfo.current = data;

              return {
                buttons: [
                  <div
                    className={"text-sm nodeflag " + "nodeid" + rowInfo.node.id}
                  >
                    {/* <button
                      id="addChildEl"
                      className="px-2 py-1 mx-2 ml-6 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Add Child"
                      onClick={() => handleOpenFormAddNodeChild(rowInfo)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button> */}

                    <button
                      id="updateEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Update"
                      onClick={() => handleOpenFormUpdate(rowInfo)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>

                    {/* <button
                      id="updateIconEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Update Icon"
                      onClick={() => handleOpenFormIcon(rowInfo)}
                    >
                      <i className="fa-solid fa-file-pen"></i>
                    </button> */}

                    {/* <button
                      id="deleteEl"
                      className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                      label="Delete"
                      onClick={() => handleOpenFormDelete(rowInfo)}
                      // onClick={() => removeNode(rowInfo)}
                    >
                      <i className="fa-sharp fa-solid fa-trash"></i>
                    </button>

                    <button
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Alert"
                      onClick={() => handleOpenPopupInfo(rowInfo)}
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
