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
}) => {
  const [updateSidebar, setUpdateSidebar] = useState(selectedSidebar); //rowInfo
  const [input, setInput] = useState("");
  const [originalDataAll, setOriginalDataAll] = useState([]);
  const [isOpenFormAddNode, setIsOpenFormAddNode] = useState(false);

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
    console.log("originalDataAll", originalDataAll);
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

  return (
    <div className="mt-32" style={{ flex: "0 0 auto", padding: "0 15px" }}>
      <h3 className="text-3xl hello font-medium text-center mb-5">
        Sidebar Management
      </h3>
      <div className="">
        <button
          className="p-2 px-3 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
          onClick={handleOpenFormAddNode}
        >
          Create Node
        </button>
        {/* <input
            className="border p-2 rounded-md transition-primary"
            ref={inputEl}
            type="text"
          /> */}

        {/* <div className="flex mb-2">
          <button
            className="p-2 px-3 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={addNodeChild}
          >
            Add Node Child
          </button>
          <input
            className="border p-2 rounded-md transition-primary"
            ref={inputChildEl}
            type="text"
          />
          <br />
        </div>
        <div className="flex">
          <button
            className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={updateHandler}
          >
            Update Node
          </button>
          <input
            className="border p-2 rounded-md transition-primary"
            ref={updateInputEl}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <br />
        </div> */}

        <button
          className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
          onClick={reloadPage}
        >
          Refresh Page
        </button>

        <br />
      </div>
      <br />
      <button
        className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
        onClick={expandAll}
      >
        Expand All
      </button>
      <button
        className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
        onClick={collapseAll}
      >
        Collapse All
      </button>
      {isChangeTree ? (
        <button
          disabled={isChangeTree}
          className="p-2 px-4 m-2 text-white bg-blue-400 rounded-md transition-primary"
        >
          Save
        </button>
      ) : (
        <button
          onClick={handleSaving}
          className="p-2 px-4 m-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-primary"
        >
          Save
        </button>
      )}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <form
        style={{ display: "inline-block" }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="find-box">
          <input
            className="border rounded-md p-2"
            id="find-box"
            type="text"
            placeholder="Search"
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
          &nbsp;
          {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
          &nbsp;/&nbsp;
          {searchFoundCount || 0}
        </span>
      </form>
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
