import React, { useState, useEffect, useCallback } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import { toast } from "react-toastify";
import FormAddNode from "../sidebarForm/FormAddNode";

const HeaderSidebarManagement = ({
  expandAll,
  collapseAll,
  fetchSidebars,
  treeDataUpdateAll,
  treeDataAddNode,
  treeDataRemoveNode,
  isChangeTree,
  deParseData,
  searchInput,
  setSearchInput,
  setCurrentSearch,
  currentSearch,
}) => {
  const [originalDataAll, setOriginalDataAll] = useState([]);
  const [isOpenFormAddNode, setIsOpenFormAddNode] = useState(false);
  const [isChangeSearch, setIsChangeSearch] = useState(false);

  const callbackRemoveNode = useCallback(async () => {
    if (treeDataRemoveNode.length !== 0) {
      Promise.all(
        treeDataRemoveNode.map(
          async (e) => await sidebarAPI.deleteSidebar(e.id)
        )
      )
        .then(() => showToastMessageSuccess("Remove node successfully!"))
        .then((msgSuccess) => fetchSidebars())
        .catch(() => showToastMessageError("Remove node error!"))
        .catch((error) => console.log("error", error));
    }
  }, [treeDataRemoveNode]);

  const callbackAddNode = useCallback(async () => {
    Promise.all(
      treeDataAddNode.map(async (e) => await sidebarAPI.addSidebar(e))
    )
      // .then(() => showToastMessageSuccess("Add node successfully!"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError("Add node error!"))
      .catch((error) => console.log("error", error));
  }, [treeDataAddNode]);

  useEffect(() => {
    setOriginalDataAll(deParseData(treeDataUpdateAll, []));
  }, [treeDataUpdateAll]);

  // useEffect(() => {
  //   setOriginalDataUpdate(deParseData(treeDataUpdate, []));
  // }, [treeDataUpdate]);

  //  Add Node
  useEffect(() => {
    callbackAddNode();
  }, [treeDataAddNode]);

  // Remove Node
  useEffect(() => {
    callbackRemoveNode();
  }, [treeDataRemoveNode]);

  const handleSaving = async () => {
    const mockApiSideBars = await sidebarAPI.getSidebars();
    const mockApiIds = mockApiSideBars.data.map((e) => e.id);
    // Update sidebars

    Promise.all(
      originalDataAll
        .filter((e) => mockApiIds.includes(e.id))
        .map(async (e) => await sidebarAPI.updateSidebar(e.id, e))
    )
      .then(() => showToastMessageSuccess("Save successfully!"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError("Save error!"))
      .catch((error) => console.log("error", error));
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

  // Transfer Data

  const reloadPage = () => {
    window.location.reload();
  };

  const handleOpenFormAddNode = () => {
    setIsOpenFormAddNode(true);
  };

  const handleCloseFormAddNode = () => {
    setIsOpenFormAddNode(false);
  };

  // const handleSearchNode = (e) => {
  //   if (e.key === "Enter") {
  //     setSearchInput(e.target.value);
  //     setIsChangeSearch(true);
  //   }
  // };

  const handleChangeInputSearch = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value !== "") {
      setIsChangeSearch(true);
    } else {
      setIsChangeSearch(false);
    }
    expandAll();
  };

  const handleClearSearch = () => {
    setIsChangeSearch(false);
    setSearchInput("");
  };

  const handleSelectSearch = (value) => {
    setCurrentSearch(value);
  };

  return (
    <div className="mt-32" style={{ flex: "0 0 auto", padding: "0 15px" }}>
      <h3 className="text-3xl hello font-medium text-center mb-5">
        Sidebar Management
      </h3>
      <form
        className="flex"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label
          htmlFor="searchSelect"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        ></label>
        <select
          id="searchSelect"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md font-normal rounded-l-full focus:ring-blue-500 focus:border-blue-500 block 1/2 lg:w-1/6 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => handleSelectSearch(e.target.value)}
          defaultValue={currentSearch}
        >
          <option value="searchNode">Search node</option>
          <option value="searchFocus">Search focus</option>
        </select>
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            className="w-full xl:1/3 bg-white placeholder:font-italitc border border-slate-300 rounded-r-full py-2 pl-10 pr-4 focus:outline-none transition-primary"
            placeholder="Enter your node to search focus"
            type="text"
            value={searchInput}
            // onKeyDown={(e) => handleSearchNode(e)}
            onChange={(e) => handleChangeInputSearch(e)}
          />
          {isChangeSearch ? (
            <button
              className="absolute inset-y-0 flex items-center -right-1 mr-5"
              onClick={(e) => handleClearSearch(e)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          ) : null}
        </label>
      </form>

      <div className="flex justify-start gap-4 text-white text-center my-5 transition-primary">
        <button
          className="p-2 px-3 flex justify-center items-center gap-2 bg-sky-600 rounded-md hover:bg-sky-700 transition-primary"
          onClick={handleOpenFormAddNode}
        >
          <i className="fa-solid fa-plus"></i>
          <p className="hidden lg:block">Create node</p>
        </button>
        {isChangeTree ? (
          <button
            disabled={isChangeTree}
            className="p-2 px-3 flex justify-center items-center gap-2 text-white bg-blue-400 rounded-md transition-primary"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <p className="hidden lg:block">Save</p>
          </button>
        ) : (
          <button
            onClick={handleSaving}
            className="p-2 px-3 flex justify-center items-center gap-2  text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-primary"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <p className="hidden lg:block">Save</p>
          </button>
        )}
        <button
          className="p-2 px-3 flex justify-center items-center gap-2 bg-gray-500 rounded-md hover:bg-gray-600 transition-primary"
          onClick={expandAll}
        >
          <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          <p className="hidden lg:block">Expand all</p>{" "}
        </button>
        <button
          className="p-2 px-3 flex justify-center items-center gap-2 bg-gray-500 rounded-md hover:bg-gray-600 transition-primary"
          onClick={collapseAll}
        >
          <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
          <p className="hidden lg:block">Collapse all</p>
        </button>
        <button
          className="p-2 px-3 flex justify-center items-center gap-2 bg-green-500 rounded-md hover:bg-green-600 transition-primary"
          onClick={reloadPage}
        >
          <i className="fa-solid fa-rotate-right"></i>
          <p className="hidden lg:block">Refresh page</p>
        </button>
      </div>

      <FormAddNode
        handleOpenFormAddNode={handleOpenFormAddNode}
        handleCloseFormAddNode={handleCloseFormAddNode}
        isOpenFormAddNode={isOpenFormAddNode}
        fetchSidebars={fetchSidebars}
        showToastMessageError={showToastMessageError}
        showToastMessageSuccess={showToastMessageSuccess}
      />
    </div>
  );
};

export default HeaderSidebarManagement;
