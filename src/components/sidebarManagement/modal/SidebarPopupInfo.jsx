import React from "react";

const SidebarForm = ({ isOpenPopupInfo, handleClosePopupInfo, popupInfo }) => {
  const node = popupInfo?.node;

  const objInfoNode = () => {
    if (node) {
      return (
        <div className="break-words">
          {Object.entries(node).join(" - \n").replaceAll(",", ":  ")}
        </div>
      );
    }
  };

  return (
    <div>
      {isOpenPopupInfo ? (
        <>
          <div className="modal fade fixed bg-black bg-opacity-10 pt-80 pl-[480px] w-full h-full outline-none overflow-x-hidden overflow-y-auto inset-0 transition-primary">
            <div className="relative w-full max-w-md h-full md:h-auto">
              <div className="relative bg-gray-100 rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white transition-primary"
                  data-modal-toggle="popup-modal"
                  onClick={handleClosePopupInfo}
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
                  <h3 className="mb-5 p-2 text-xl font-medium text-gray-900 dark:text-gray-400">
                    Info passed to the icon and button generators!
                  </h3>
                  <div className="text-start">
                    <h4>
                      <span className="font-medium">Node: </span>
                      {objInfoNode()}
                    </h4>
                    <h4>
                      <span className="font-medium">Path: </span>[
                      {popupInfo.path.join(", ")}]
                    </h4>
                    <h4>
                      <span className="font-medium">TreeIndex: </span>
                      {popupInfo.treeIndex}
                    </h4>
                  </div>
                  <div className="text-end transition-primary">
                    <button
                      data-modal-toggle="popup-modal"
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-primary"
                      onClick={handleClosePopupInfo}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SidebarForm;
