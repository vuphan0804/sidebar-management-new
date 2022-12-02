import React, { useState, useCallback, useEffect } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import icons from "../../../dataIcons/icons";
import { toast } from "react-toastify";
const FormManagement = ({
  isOpenFormUpdate,
  handleCloseFormUpdate,
  selectedSidebar,
  fetchSidebars,
  showToastMessageSuccess,
  showToastMessageError,
  treeData,
  deParseData,
}) => {
  const [formValue, setFormValue] = useState({
    title: "",
    id: "",
    parentId: "",
    count: "",
    icon: "",
    children: [],
  });
  const [updateNodeSidebar, setUpdateNodeSidebar] = useState(selectedSidebar);
  const [isSelectedIcon, setIsselectedIcon] = useState(false);
  const [checkedIcon, setCheckedIcon] = useState(true);
  const [inputIconURL, setInputIconURL] = useState("");
  const [originalTreeData, setOriginalTreeData] = useState([]);

  console.log("treeData", treeData);
  const handleSelectedIcon = () => {
    setIsselectedIcon(true);
  };

  const handleNotSelectedIcon = () => {
    setIsselectedIcon(false);
  };

  const handleChangeIcon = () => {
    setCheckedIcon(!checkedIcon);
  };
  const handleChangeIconURL = (value) => {
    setInputIconURL(value);
    setFormValue((prev) => ({ ...prev, icon: value }));
  };

  useEffect(() => {
    if (selectedSidebar) {
      setFormValue(selectedSidebar?.node);
      setUpdateNodeSidebar(selectedSidebar);
    }
  }, [selectedSidebar]);

  useEffect(() => {
    if (!isOpenFormUpdate) {
      handleNotSelectedIcon();
      setInputIconURL("");
    }
  }, [isOpenFormUpdate]);
  useEffect(() => {
    setOriginalTreeData(deParseData(treeData, []));
  }, [treeData]);

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
  const callbackUpdateNode = useCallback(async () => {
    const nodeUpdate = {
      title: formValue.title,
      parentId: formValue.parentId,
      id: formValue.id,
      count: formValue.count,
      icon: formValue.icon,
    };

    if (nodeUpdate.id) {
      await sidebarAPI
        .updateSidebar(nodeUpdate.id, nodeUpdate)
        .then(() => showToastMessageSuccess("Update node successfully!"))
        .then((msgSuccess) => fetchSidebars())
        .catch(() => showToastMessageError("Update node error!"))
        .catch((error) => console.log("error", error));
    }
    handleCloseFormUpdate();
  }, [formValue]);

  return (
    <div>
      {isOpenFormUpdate ? (
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
                onClick={handleCloseFormUpdate}
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
                  Update node
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
                      disabled={true}
                      value={formValue.id}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="number"
                      name="id"
                      id="id"
                      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                    {/* <input
                      value={formValue.parentId}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      type="text"
                      name="parentId"
                      id="parentId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="null is parent node"
                    /> */}
                    <select
                      name="parentId"
                      id="parentId"
                      className="w-32 h-10"
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                    >
                      {originalTreeData?.map((node) => {
                        return <option value={node.id}>{node.title}</option>;
                      })}
                    </select>
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
                              handleSelectedIcon();
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
                    <button
                      className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                      type="button"
                    >
                      <img
                        className="w-8 h-8 mx-auto"
                        src={`${selectedSidebar?.node?.icon}`}
                        alt=""
                      />
                    </button>
                    <i className="m-4 fa-solid fa-arrow-right"></i>
                    {isSelectedIcon ? (
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
                      onChange={(e) => handleChangeIconURL(e.target.value)}
                      type="text"
                      name="iconURL"
                      id="iconURL"
                      value={inputIconURL}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="iconURL"
                    />
                  </div>
                  <div className="text-center mt-6">
                    <button
                      className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                      type="button"
                    >
                      <img
                        className="w-8 h-8 mx-auto"
                        src={`${selectedSidebar?.node?.icon}`}
                        alt=""
                      />
                    </button>
                    <i className="m-4 fa-solid fa-arrow-right"></i>
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
                    onClick={() => callbackUpdateNode()}
                  >
                    Accept
                  </button>
                  <button
                    data-modal-toggle="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-primary"
                    onClick={handleCloseFormUpdate}
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
