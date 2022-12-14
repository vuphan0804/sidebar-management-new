import React, { useState, useCallback, useEffect, useRef } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import icons from "../../../dataIcons/icons";
const FormUpdateNode = ({
  isOpenFormUpdate,
  handleCloseFormUpdate,
  selectedSidebar,
  fetchSidebars,
  showToastMessageSuccess,
  showToastMessageError,
}) => {
  const [checkedIconURL, setCheckedIconURL] = useState(false);
  const [checkedIconLocal, setCheckedIconLocal] = useState(false);
  const [inputIconURL, setInputIconURL] = useState("");
  const [inputIconLocal, setInputIconLocal] = useState("");
  const [formValue, setFormValue] = useState({
    name: "",
    id: "",
    parentId: "",
    count: "",
    icon: "",
    isAddNodeChild: "",
    isRemoveNode: "",
    isInfoNode: "",
  });

  const titleRef = useRef();

  const callbackUpdateNode = useCallback(async () => {
    const titleValue = titleRef.current.value;

    if (titleValue === "") {
      titleRef.current.focus();
      return;
    }

    if (formValue.icon === "") {
    }
    const nodeUpdate = {
      title: formValue.name,
      parentId: formValue.parentId,
      id: formValue.id,
      count: formValue.count,
      icon: formValue.icon,
      isAddNodeChild: formValue.isAddNodeChild,
      isRemoveNode: formValue.isRemoveNode,
      isInfoNode: formValue.isInfoNode,
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

  useEffect(() => {
    if (selectedSidebar) {
      setFormValue(selectedSidebar?.node);
    }
  }, [selectedSidebar]);

  useEffect(() => {
    if (!checkedIconLocal && !checkedIconURL) {
      setFormValue((prev) => ({
        ...prev,
        icon: "",
      }));
    }
    if (checkedIconLocal) {
      setFormValue((prev) => ({
        ...prev,
        icon: inputIconLocal,
      }));
    }
    if (checkedIconURL) {
      setFormValue((prev) => ({
        ...prev,
        icon: inputIconURL,
      }));
    }
  }, [checkedIconLocal, checkedIconURL, inputIconURL]);

  useEffect(() => {
    if (!isOpenFormUpdate) {
      setInputIconURL("");
      setInputIconLocal("");
      setCheckedIconLocal(false);
      setCheckedIconURL(false);
    }
    if (isOpenFormUpdate) {
      if (checkedIconURL) {
        // setInputIconURL(selectedSidebar.icon);
        console.log("selectedSidebar.icon", selectedSidebar.icon);
      }
      console.log("selectedSidebar.icon", selectedSidebar.node?.icon);
    }
  }, [isOpenFormUpdate]);

  const handleChange = (name, value) => {
    setFormValue((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCheckedIconLocal = () => {
    setCheckedIconURL(false);
    setCheckedIconLocal((state) => !state);
  };

  const handleCheckedIconURL = () => {
    setCheckedIconLocal(false);
    setCheckedIconURL((state) => !state);
  };

  const handleChangeIconURL = (value) => {
    setInputIconURL(value);
  };

  console.log("formValue", formValue);
  console.log("checkedIconURL", checkedIconURL);
  console.log("checkedIconLocal", checkedIconLocal);

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
                  <div className="col-span-2">
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      value={formValue.name}
                      onChange={(e) => {
                        handleChange(e.target.name, e.target.value);
                      }}
                      ref={titleRef}
                      type="text"
                      name="name"
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="title"
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
                        checked={checkedIconLocal}
                        onChange={(e) => {
                          handleCheckedIconLocal(e);
                        }}
                      />
                      Icon
                    </label>
                    <div className="overflow-y-scroll h-32 grid grid-cols-3">
                      {icons.map((iconz, index) => {
                        return (
                          <button
                            disabled={!checkedIconLocal}
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
                              setInputIconLocal(iconz);
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
                    {inputIconLocal ? (
                      <button
                        className="bg-slate-300 hover:outline outline-orange-300 focus:outline m-1 w-10 h-10 rounded-md text-center mx-auto"
                        type="button"
                      >
                        <img
                          className="w-8 h-8 mx-auto"
                          src={`${inputIconLocal}`}
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
                        checked={checkedIconURL}
                        onChange={(e) => handleCheckedIconURL(e)}
                      />
                      Icon URL
                    </label>
                    <input
                      onChange={(e) => handleChangeIconURL(e.target.value)}
                      type="text"
                      name="iconURL"
                      id="iconURL"
                      disabled={!checkedIconURL}
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
                    {inputIconURL !== "" ? (
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
                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <input
                        className="mr-2"
                        type="checkbox"
                        name="addNodeChild"
                        id="addNodeChild"
                        checked={formValue.isAddNodeChild}
                        onChange={(e) =>
                          handleChange("isAddNodeChild", e.target.checked)
                        }
                      />
                      Add child node
                      <button
                        id="addChildNodeBtn"
                        className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                        label="Add Child"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </label>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <input
                        className="mr-2"
                        type="checkbox"
                        name="removeNode"
                        id="removeNode"
                        checked={formValue.isRemoveNode}
                        onChange={(e) =>
                          handleChange("isRemoveNode", e.target.checked)
                        }
                      />
                      Remove node
                      <button
                        id="deleteNodeBtn"
                        className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                        label="Delete"
                      >
                        <i className="fa-sharp fa-solid fa-trash"></i>
                      </button>
                    </label>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <input
                        className="mr-2"
                        type="checkbox"
                        name="infoNode"
                        id="infoNode"
                        checked={formValue.isInfoNode}
                        onChange={(e) =>
                          handleChange("isInfoNode", e.target.checked)
                        }
                      />
                      Information node
                      <button
                        id="InfoNodeBtn"
                        className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                        label="Info"
                      >
                        <i className="fa-sharp fa-solid fa-circle-info"></i>
                      </button>
                    </label>
                  </div>
                </form>
                <div className="text-end mt-5">
                  <button
                    data-modal-toggle="popup-modal"
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 transition-primary"
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

export default FormUpdateNode;
