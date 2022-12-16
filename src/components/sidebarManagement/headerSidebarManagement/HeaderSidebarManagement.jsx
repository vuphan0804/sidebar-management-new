import React, { useState, useEffect, useCallback } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import { toast } from "react-toastify";
import FormAddNode from "../sidebarForm/FormAddNode";

const HeaderSidebarManagement = ({
  updateNode,
  expandAll,
  collapseAll,
  searchString,
  setSearchString,
  searchFoundCount,
  selectNextMatch,
  selectPrevMatch,
  searchFocusIndex,
  selectedSidebar,
  fetchSidebars,
  treeDataUpdateAll,
  treeDataUpdateNode,
  treeDataAddNode,
  treeDataAddNodeChild,
  treeDataRemoveNode,
  isChangeTree,
  deParseData,
  searchNode,
  setSearchNode,
}) => {
  const [updateSidebar, setUpdateSidebar] = useState(selectedSidebar); //rowInfo
  const [input, setInput] = useState("");
  const [originalDataAll, setOriginalDataAll] = useState([]);
  const [isOpenFormAddNode, setIsOpenFormAddNode] = useState(false);
  const [isChangeSearch, setIsChangeSearch] = useState(false);

  const callbackUpdateNode = useCallback(async () => {
    const nodeUpdate = {
      title: treeDataUpdateNode.title,
      expanded: treeDataUpdateNode.expanded,
      parentId: treeDataUpdateNode.parentId,
      id: treeDataUpdateNode.id,
      count: treeDataUpdateNode.count,
    };
    if (nodeUpdate.id) {
      await sidebarAPI
        .updateSidebar(nodeUpdate.id, nodeUpdate)
        .then(() => showToastMessageSuccess("Update node successfully!"))
        .then((msgSuccess) => fetchSidebars())
        .catch(() => showToastMessageError("Update node error!"))
        .catch((error) => console.log("error", error));
    }
  }, [treeDataUpdateNode]);

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

  const callbackAddNodeChild = useCallback(async () => {
    Promise.all(
      treeDataAddNodeChild.map(async (e) => await sidebarAPI.addSidebar(e))
    )
      // .then(() => showToastMessageSuccess("Add node child successfully!"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError("Add node child error!"))
      .catch((error) => console.log("error", error));
  }, [treeDataAddNodeChild]);

  useEffect(() => {
    setUpdateSidebar(selectedSidebar);
    setInput(selectedSidebar?.node?.title || "");
  }, [selectedSidebar]);

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

  // Add Node Child
  useEffect(() => {
    callbackAddNodeChild();
  }, [treeDataAddNodeChild]);

  // Update Node
  useEffect(() => {
    callbackUpdateNode();
  }, [treeDataUpdateNode]);

  // Remove Node
  useEffect(() => {
    callbackRemoveNode();
  }, [treeDataRemoveNode]);

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

  const updateHandler = async () => {
    if (updateSidebar) {
      updateNode(updateSidebar, input);
    }
  };

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
  //     setSearchNode(e.target.value);
  //     setIsChangeSearch(true);
  //   }
  // };

  const handleChangeInputSearch = (e) => {
    setSearchNode(e.target.value);
    if (e.target.value !== "") {
      setIsChangeSearch(true);
    } else {
      setIsChangeSearch(false);
    }
    expandAll();
  };

  const handleClear = () => {
    setIsChangeSearch(false);
    setSearchNode("");
  };

  return (
    <div className="mt-32" style={{ flex: "0 0 auto", padding: "0 15px" }}>
      <h3 className="text-3xl hello font-medium text-center mb-5">
        Sidebar Management
      </h3>
      {/* <form
        className=""
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="find-box">
          <input
            className="border rounded-md p-2 w-8/12"
            id="find-box"
            type="text"
            placeholder="Search..."
            value={searchString}
            onChange={(event) => setSearchString(event.target.value)}
          />
        </label>

        <button
          className="m-2 text-sky-400"
          type="button"
          disabled={!searchFoundCount}
          onClick={selectPrevMatch}
        >
          <i className="fa-solid fa-backward"></i>
        </button>

        <button
          className="m-2 text-sky-400"
          type="submit"
          disabled={!searchFoundCount}
          onClick={selectNextMatch}
        >
          <i className="fa-solid fa-forward"></i>
        </button>

        <span>
          {searchFoundCount > 0 ? searchFocusIndex + 1 : 0} /
          {searchFoundCount || 0}
        </span>
      </form> */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="relative block ">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            className="w-8/12 bg-white placeholder:font-italitc border border-slate-300 rounded-full py-2 pl-10 pr-4 focus:outline-none"
            placeholder="Enter your node to search"
            type="text"
            value={searchNode}
            // onKeyDown={(e) => handleSearchNode(e)}
            onChange={(e) => handleChangeInputSearch(e)}
          />
          {isChangeSearch ? (
            <button
              className="absolute inset-y-0 flex items-center right-1/3 mr-5"
              onClick={(e) => handleClear(e)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          ) : null}
        </label>
      </form>

      <div className="flex justify-start gap-4 text-white text-center my-5">
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
