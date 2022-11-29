import React, { useCallback, useRef } from "react";

const SidebarForm = ({ isOpen, onCloseForm, sideBarId }) => {
  // const [values, setValues] = useState({
  //   title: "",
  //   subtiltle: "",
  // });
  const titleEl = useRef();
  const subTitleEl = useRef();

  // const handleChange = (e) => {
  //   const { title, value } = e.target;
  //   setValues({ ...values, [title]: value });
  // };

  // const handleCloseForm = () => {
  //   handleClose();
  // };

  const formHandler = useCallback(
    () => (event) => {
      event.preventDefault();

      if (titleEl === "") {
        titleEl.current.focus();
        return;
      }
      const data = {
        title: titleEl.current?.value,
        subTitle: subTitleEl.current?.value,
      };
      // console.log(data);
    },
    []
  );

  return (
    <div>
      {isOpen ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative px-5 flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Update element</h3>
                  <button
                    className="p-1 ml-auto t border-0 text-black "
                    onClick={onCloseForm}
                  >
                    <span className="text-red-500 text-xl font-semibold">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form>
                  <div className="m-4">
                    <div>
                      <label
                        for="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter Title"
                        required
                        // value={values.title}
                        // onChange={handleChange}
                        ref={titleEl}
                      />
                    </div>
                  </div>
                  <div className="m-4">
                    <div>
                      <label
                        for="subTitle"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Count
                      </label>
                      <input
                        type="text"
                        name="subTitle"
                        id="subTitle"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter Subtitle"
                        required
                        // value={values.subtiltle}
                        // onChange={handleChange}
                        ref={subTitleEl}
                      />
                    </div>
                  </div>
                </form>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onCloseForm}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                    onClick={formHandler()}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default SidebarForm;
