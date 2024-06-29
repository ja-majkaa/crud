import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [data, setData] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputSurname, setInputSurname] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const addToExistingData = (author) => {
    if (!data) {
      setData([author]);
      return;
    }
    setData((prev) => [...prev, author]);
  };
  const deleteAuthor = (id) => {
    fetch(`http://127.0.0.1:8000/authors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then(() => deleteAuthorFromExistingData(id));
  };

  const deleteAuthorFromExistingData = async (id) => {
    if (!data) return;

    const newAuthors = data.filter((author) => author.id !== id);
    setData(newAuthors);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/authors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then((data) => setData(data));
  }, []);

  const updateAuthorInExistingData = (id, data) => {
    if (!data) return;

    const newAuthors = data.map((author) => {
      if (author.id === id) {
        return { ...author, ...data };
      }
      return author;
    });
    setData(newAuthors);
  };

  const handleEdit = (id) => {
    const data = {
      name: inputName,
      surname: inputSurname,
    };
    fetch(`http://127.0.0.1:8000/authors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then(() => updateAuthorInExistingData(id, data));
  };

  const handleAdd = () => {
    const data = {
      name: inputName,
      surname: inputSurname,
    };

    fetch("http://127.0.0.1:8000/authors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then((data) => addToExistingData(data));
  };

  const handleEditClick = (id) => {
    setEditMode(true);
    setEditId(id);

    const author = data.find((author) => author.id === id);
    setInputName(author.name);
    setInputSurname(author.surname);
  };

  return (
    <>
      <input
        type="text"
        placeholder="name"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="surname"
        value={inputSurname}
        onChange={(e) => setInputSurname(e.target.value)}
      ></input>
      <button
        onClick={() => {
          if (editMode) {
            handleEdit(editId);
            setEditMode(false);
            return;
          }
          handleAdd;
        }}
      >
        {editMode ? "Edit" : "Add"}
      </button>
      {editMode && (
        <button
          onClick={() => {
            setInputName("");
            setInputSurname("");
            setEditMode(false);
          }}
        >
          Cancel Editing
        </button>
      )}
      {data &&
        data.map((author) => (
          <div key={author.id}>
            <h2>
              <button onClick={() => handleEditClick(author.id)}>edit</button>
              {author.name} {author.surname}
              <button onClick={() => deleteAuthorFromExistingData(author.id)}>
                X
              </button>
            </h2>
          </div>
        ))}
    </>
  );
}

export default App;
