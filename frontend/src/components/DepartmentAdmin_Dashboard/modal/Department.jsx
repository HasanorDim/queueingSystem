import React, { useEffect, useState } from "react";
// import EditDepartment from "./EditDepartment";
import { useDepartmentStore } from "../../../store/useDepartmentStore";
import AddWindow from "./AddWindow";
import { useTicketStore } from "../../../store/useTicketStore";
import EditWindow from "./EditWindow";
import { useWindowStore } from "../../../store/useWindowStore";

const Department = ({ modalId, onEditChange }) => {
  const { selectedUser, editDepartment, getAllDepartments } =
    useDepartmentStore();
  const { selectedWindow, editWindow } = useWindowStore();

  const { addWindow } = useTicketStore();
  const [counters, setCounters] = useState([]);
  const [newCounterName, setNewCounterName] = useState("");
  const [editingCounterId, setEditingCounterId] = useState(null);
  const [editedCounterName, setEditedCounterName] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [editedStaffName, setEditedStaffName] = useState("");

  const [formData, setFormData] = useState([]);

  //Edit Datas
  const [isEditing, setIsEditing] = useState(onEditChange);
  const [formEditData, setFormEditData] = useState({});

  useEffect(() => {
    setIsEditing(onEditChange);
  }, [onEditChange]);

  useEffect(() => {
    if (isEditing && selectedWindow) {
      setFormEditData({
        department_id: selectedWindow.department_id || "",
        id: selectedWindow.id || "",
        service_type: selectedWindow.service_type || "",
        staff_name: selectedWindow.staff_name || "",
        window_number: selectedWindow.window_number || 0,
      });
      // setCounters(selectedUser.counters || []); // Initialize counters from selectedUser
    } else {
      setCounters([]); // Reset counters
    }
  }, [isEditing, selectedWindow]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a temporary variable with the updated formData
    const updatedFormData = {
      counters: counters, // Ensure counters are included
    };

    // Submit the form data
    if (!isEditing) {
      await addWindow(updatedFormData);
      // await editDepartment(updatedFormData);
    }

    // Reset form data
    setFormData([]);

    // Reset counters
    setCounters([]);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      editWindow(formEditData);
    }

    setFormEditData({});
  };

  const handleAddCounter = () => {
    if (newCounterName.trim() === "") {
      alert("Counter name cannot be empty!");
      return;
    }

    const newCounter = {
      id: Date.now(),
      name: newCounterName,
      staff: newStaffName,
    };

    setCounters((prevCounters) => [...prevCounters, newCounter]);
    setNewCounterName("");
  };

  const handleDeleteCounter = (id) => {
    setCounters((prevCounters) =>
      prevCounters.filter((counter) => counter.id !== id)
    );
  };

  const handleEditCounter = (id, name, staff) => {
    // Debugging
    setEditingCounterId(id);
    setEditedCounterName(name);
    setEditedStaffName(staff || "");
  };

  const handleSaveCounter = (id) => {
    setCounters((prevCounters) => {
      const updatedCounters = prevCounters.map((counter) =>
        counter.id === id
          ? { ...counter, name: editedCounterName, staff: editedStaffName }
          : counter
      );

      // Ensure formData gets the latest updated counters
      setFormData((prevFormData) => ({
        ...prevFormData,
        counters: updatedCounters,
      }));

      return updatedCounters;
    });

    // Exit edit mode and reset edited counter name
    setEditingCounterId(null);
    setEditedCounterName("");
    setEditedStaffName("");
  };

  return (
    <dialog id={modalId} className="modal">
      {isEditing ? (
        <EditWindow
          modalId={modalId}
          // selectedUser={selectedUser}
          // formData={formData}
          formEditData={formEditData}
          handleSubmitEdit={handleSubmitEdit}
          selectedWindow={selectedWindow}
          // setFormData={setFormData}
          setFormEditData={setFormEditData}
          counters={counters}
          setCounters={setCounters}
          editingCounterId={editingCounterId}
          setEditingCounterId={setEditingCounterId}
          editedCounterName={editedCounterName}
          setEditedCounterName={setEditedCounterName}
          handleSubmit={handleSubmit}
          handleAddCounter={handleAddCounter}
          handleDeleteCounter={handleDeleteCounter}
          handleEditCounter={handleEditCounter}
          handleSaveCounter={handleSaveCounter}
          newCounterName={newCounterName}
          setNewCounterName={setNewCounterName}
        />
      ) : (
        <AddWindow
          modalId={modalId}
          handleEditCounter={handleEditCounter}
          counters={counters}
          setCounters={setCounters}
          editedCounterName={editedCounterName}
          editingCounterId={editingCounterId}
          setEditedCounterName={setEditedCounterName}
          handleDeleteCounter={handleDeleteCounter}
          handleSaveCounter={handleSaveCounter}
          newCounterName={newCounterName}
          setNewCounterName={setNewCounterName}
          newStaffName={newStaffName} // ✅ Corrected
          setNewStaffName={setNewStaffName} // ✅ Corrected
          setEditedStaffName={setEditedStaffName} // ✅ Corrected
          handleSubmit={handleSubmit}
          handleAddCounter={handleAddCounter}
          editedStaffName={editedStaffName}
        />
      )}
    </dialog>
  );
};

export default Department;
