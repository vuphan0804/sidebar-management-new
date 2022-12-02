import React, { useState, useCallback, useEffect } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import icons from "../../../dataIcons/icons";
import { toast } from "react-toastify";
const FormManagement = ({
  isOpenFormAddNode,
  handleCloseFormAddNode,
  fetchSidebars,
  showToastMessageSuccess,
  showToastMessageError,
}) => {
  const [formValue, setFormValue] = useState({
    title: "",
    id: "",
    parentId: "",
    count: "",
    icon: "",
    children: [],
  });
  const [isSelectedIcon, setIsselectedIcon] = useState(false);
  const [checkedIcon, setCheckedIcon] = useState(true);
  const [inputIconURL, setInputIconURL] = useState("");
  const handleChangeIcon = () => {
    setCheckedIcon(!checkedIcon);
  };
  const handleChangeIconURL = (e) => {
    setInputIconURL(e.target.value);
  };

  const iconURL =
    "data:image/png;base64,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";
  const handleChange = (name, value) => {
    setFormValue((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    if (!checkedIcon) {
      setFormValue((prev) => ({
        ...prev,
        icon: inputIconURL,
      }));
    }
  }, [checkedIcon]);
  const callbackAddNodeNode = useCallback(async () => {
    console.log("keke");
    const nodeAdd = {
      title: formValue.title,
      parentId: formValue.parentId,
      id: formValue.id,
      count: formValue.count,
      icon: formValue.icon,
    };
    if (nodeAdd.id) {
      await sidebarAPI
        .addSidebar(nodeAdd)
        .then(() => showToastMessageSuccess("AddNode node successfully!"))
        .then((msgSuccess) => fetchSidebars())
        .catch(() => showToastMessageError("AddNode node error!"))
        .catch((error) => console.log("error", error));
    }
    handleCloseFormAddNode();
  }, [formValue]);

  useEffect(() => {
    if (!isOpenFormAddNode) {
      formValue.icon = "";
    }
  }, [isOpenFormAddNode]);

  return (
    <div>
      {isOpenFormAddNode ? (
        <div
          id="authentication-modal"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed bg-black bg-opacity-10 pl-96 pt-52 top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full"
        >
          <div className="relative w-full max-w-md h-full md:h-auto">
            <div className="relative bg-gray-100 rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="authentication-modal"
                onClick={handleCloseFormAddNode}
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
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
                  Create node
                </h3>
                <form className="grid grid-cols-2 gap-5" action="#">
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      value={formValue.title}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="text"
                      name="title"
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="title"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="id"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ID Node
                    </label>
                    <input
                      value={formValue.id}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="number"
                      name="id"
                      id="id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Id Node"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="parentId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      parentId
                    </label>
                    <input
                      value={formValue.parentId}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="text"
                      name="parentId"
                      id="parentId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="null is parent node"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="count"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Count
                    </label>
                    <input
                      value={formValue.count}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="number"
                      name="count"
                      id="count"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="count"
                    />
                  </div>
                  {/* Icon local */}
                  <div>
                    <label
                      htmlFor="icon"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      <input
                        className="mr-2"
                        type="checkbox"
                        name=""
                        id="checkedIconLocal"
                        checked={checkedIcon}
                        onChange={(e) => {
                          handleChangeIcon(e);
                        }}
                      />
                      Icon
                    </label>
                    <div className="overflow-y-scroll h-32 grid grid-cols-3">
                      {icons.map((iconz, index) => {
                        return (
                          <button
                            className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                            type="button"
                            key={index}
                            name="icon"
                            value={iconz}
                            onClick={(e) => {
                              handleChange(
                                e.currentTarget.name,
                                e.currentTarget.value
                              );
                            }}
                          >
                            <img
                              className="w-8 h-8 mx-auto"
                              src={`${iconz}`}
                              alt=""
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-center mt-16">
                    <p className="mb-2">Icon select:</p>{" "}
                    {formValue.icon ? (
                      <button
                        className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                        type="button"
                      >
                        <img
                          className="w-8 h-8 mx-auto"
                          src={`${formValue.icon}`}
                          alt=""
                        />
                      </button>
                    ) : null}
                  </div>
                  {/* Icon URL */}
                  <div>
                    <label
                      htmlFor="iconURL"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <input
                        className="mr-2"
                        type="checkbox"
                        name=""
                        id="checkedIconURL"
                        checked={!checkedIcon}
                        onChange={(e) => handleChangeIcon(e)}
                      />
                      Icon URL
                    </label>
                    <input
                      onChange={(e) => handleChangeIconURL(e)}
                      type="text"
                      name="iconURL"
                      id="iconURL"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="iconURL"
                    />
                  </div>
                  <div className="text-center mt-6">
                    {inputIconURL ? (
                      <button
                        className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                        type="button"
                      >
                        <img
                          className="w-8 h-8 mx-auto"
                          src={inputIconURL}
                          alt=""
                        />
                      </button>
                    ) : null}
                  </div>
                </form>
                <div className="text-end mt-5">
                  <button
                    data-modal-toggle="popup-modal"
                    type="submit"
                    className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 transition-primary"
                    onClick={() => callbackAddNodeNode()}
                  >
                    Accept
                  </button>
                  <button
                    data-modal-toggle="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-primary"
                    onClick={handleCloseFormAddNode}
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FormManagement;
