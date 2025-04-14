import React, { useEffect, useState } from "react";
import EditDepartment from "./EditDepartment";
import AddDepartment from "./AddDepartment";
import { useDepartmentStore } from "../../../store/useDepartmentStore";

const Department = ({ modalId, onEditChange }) => {
  const { addDepartment, selectedUser, editDepartment, getAllDepartments } =
    useDepartmentStore();

  const [counters, setCounters] = useState([]);
  const [newCounterName, setNewCounterName] = useState("");
  const [editingCounterId, setEditingCounterId] = useState(null);
  const [editedCounterName, setEditedCounterName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    counters: [],
  });

  const [isEditing, setIsEditing] = useState(onEditChange);

  useEffect(() => {
    setIsEditing(onEditChange);
  }, [onEditChange]);

  useEffect(() => {
    if (isEditing && selectedUser) {
      setFormData({
        id: selectedUser.id || "",
        name: selectedUser.name || "",
        description: selectedUser.description || "",
        status: "active",
        counters: selectedUser.counters || [],
      });
      setCounters(selectedUser.counters || []); // Initialize counters from selectedUser
    } else {
      setFormData({
        name: "",
        description: "",
        status: "active",
        counters: [],
      });
      setCounters([]); // Reset counters
    }
  }, [isEditing, selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a temporary variable with the updated formData
    const updatedFormData = {
      ...formData,
      counters: counters, // Ensure counters are included
    };

    // Submit the form data
    if (isEditing) {
      await editDepartment(updatedFormData);
      await getAllDepartments(); // Re-fetch departments to update selectedUser
    } else {
      await addDepartment(updatedFormData);
      await getAllDepartments(); // Re-fetch departments to update selectedUser
    }

    // Reset form data
    setFormData({
      name: "",
      description: "",
      status: "active",
      counters: [],
    });

    // Reset counters
    setCounters([]);
  };

  const handleAddCounter = () => {
    if (newCounterName.trim() === "") {
      alert("Counter name cannot be empty!");
      return;
    }

    const newCounter = {
      id: Date.now(),
      name: newCounterName,
    };

    setCounters((prevCounters) => [...prevCounters, newCounter]);
    setNewCounterName("");
  };

  const handleDeleteCounter = (id) => {
    setCounters((prevCounters) =>
      prevCounters.filter((counter) => counter.id !== id)
    );
  };

  const handleEditCounter = (id, name) => {
    setEditingCounterId(id);
    setEditedCounterName(name);
  };

  const handleSaveCounter = (id) => {
    setCounters((prevCounters) => {
      const updatedCounters = prevCounters.map((counter) =>
        counter.id === id ? { ...counter, name: editedCounterName } : counter
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
  };

  return (
    <dialog id={modalId} className="modal">
      {isEditing ? (
        <EditDepartment
          modalId={modalId}
          selectedUser={selectedUser}
          formData={formData}
          setFormData={setFormData}
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
        <AddDepartment
          modalId={modalId}
          formData={formData}
          setFormData={setFormData}
          // counters={counters}
          // setCounters={setCounters}
          // newCounterName={newCounterName}
          // setNewCounterName={setNewCounterName}
          handleSubmit={handleSubmit}
          // handleAddCounter={handleAddCounter}
        />
      )}
    </dialog>
  );
};

export default Department;
