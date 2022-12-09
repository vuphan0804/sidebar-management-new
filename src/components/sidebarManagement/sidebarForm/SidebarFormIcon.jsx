import React, { useState, useCallback, useEffect } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import { toast } from "react-toastify";
import icons from "../../../dataIcons/icons";

const SidebarFormIcon = ({
  isOpenFormIcon,
  handleCloseFormIcon,
  selectedNodeUpdateIcon,
  treeDataUpdateIcon,
  fetchSidebars,
  updateIcon,
}) => {
  const [selectedIcon, setSelectedIcon] = useState([]);
  const [updateIconSelected, setUpdateIconSelected] = useState(
    selectedNodeUpdateIcon
  );

  const callbackUpdateIcon = useCallback(async () => {
    const nodeUpdateIcon = {
      title: treeDataUpdateIcon.title,
      expanded: treeDataUpdateIcon.expanded,
      parentId: treeDataUpdateIcon.parentId,
      id: treeDataUpdateIcon.id,
      count: treeDataUpdateIcon.count,
      icon: selectedIcon,
    };
    if (nodeUpdateIcon.id) {
      await sidebarAPI
        .updateSidebar(nodeUpdateIcon.id, nodeUpdateIcon)
        .then(() => showToastMessageSuccess("Update icon successfully!"))
        .then((msgSuccess) => fetchSidebars())
        .catch(() => showToastMessageError("Update icon error!"))
        .catch((error) => console.log("error", error));
    }
  }, [treeDataUpdateIcon]);

  useEffect(() => {
    callbackUpdateIcon();
  }, [treeDataUpdateIcon]);

  useEffect(() => {
    setUpdateIconSelected(selectedNodeUpdateIcon);
    setSelectedIcon(selectedNodeUpdateIcon?.node?.icon || "");
  }, [selectedNodeUpdateIcon]);

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

  const updateIconHandler = async () => {
    if (updateIconSelected) {
      updateIcon(updateIconSelected, selectedIcon);
    }
  };

  return (
    <div>
      {isOpenFormIcon ? (
        <div className="modal fade fixed bg-black bg-opacity-10 pt-80 pl-[480px] w-full h-full outline-none overflow-x-hidden overflow-y-auto inset-0 transition-primary">
          <div className="relative w-full max-w-md h-full md:h-auto">
            <div className="relative bg-gray-100 rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="popup-modal"
                onClick={handleCloseFormIcon}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Choose a icon!
                </h3>
                <div className="grid grid-cols-2 mb-4 h-48 w-72 overflow-y-scroll border-1 border-gray-500 mx-auto">
                  {icons.map((icon, index) => {
                    return (
                      <button
                        className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-2 w-12 h-12 rounded-sm text-center mx-auto"
                        key={index}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        <img
                          className="w-10 h-10 mx-auto "
                          src={`${icon}`}
                          alt=""
                        />
                      </button>
                    );
                  })}
                </div>
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 transition-primary"
                  onClick={updateIconHandler}
                >
                  Accept
                </button>
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-primary"
                  onClick={handleCloseFormIcon}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SidebarFormIcon;
