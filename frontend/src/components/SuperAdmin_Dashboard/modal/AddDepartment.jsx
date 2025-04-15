import React, { useState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { useDepartmentStore } from "../../../store/useDepartmentStore";

const AddDepartment = ({
  modalId, // Add modalId prop
  formData,
  setFormData,
  handleSubmit,
}) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const { isAddingDep } = useDepartmentStore();
  const prevIsAddingDep = useRef(false);

  useEffect(() => {
    console.log("prevIsAddingDep.current: ", prevIsAddingDep.current);
    if (prevIsAddingDep.current && !isAddingDep) {
      // just finished loading
      const modal = document.getElementById(modalId);
      if (modal) modal.close();
    }
    prevIsAddingDep.current = isAddingDep;
  }, [isAddingDep, modalId]);

  useEffect(() => {
    // Check if either name or description is null, undefined, or empty
    if (
      !formData?.name ||
      !formData?.description ||
      formData?.name.trim() === "" ||
      formData?.description.trim() === ""
    ) {
      setIsEmpty(true); // If data is missing or empty, set isEmpty to true
    } else {
      setIsEmpty(false); // If data is present, set isEmpty to false
    }
  }, [formData]); // This effect runs every time formData changes

  return (
    <div className="modal-box overflow-hidden overflow-y-auto">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Add Department</h2>
      </div>
      <form method="dialog" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 p-6">
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Department Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Health depart..."
            />
          </div>

          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Department Descriptions
            </label>
            <input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              type="text"
              className="italic w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Department..."
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          {/* <button
            className="btn w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
            onClick={() => document.getElementById(modalId).close()}
            disabled={isEmpty}
          >
            <Plus /> Create Department
          </button> */}
          <button
            type="submit"
            className="btn w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            disabled={isEmpty || isAddingDep}
          >
            {isAddingDep ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus />
                Create Department
              </>
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => document.getElementById(modalId).close()}
        >
          ✕
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
