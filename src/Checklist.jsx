import React, { useState } from "react";

export default function Checklist({ title, items }) {
  const [list, setList] = useState(items);
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() === "") return;
    setList([...list, { text: newItem }]);
    setNewItem("");
  };

  const handleDelete = (index) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  return (
    <section className="box">
      <h2>{title}</h2>
      <ul>
        {list.map((item, idx) => (
          <li key={idx}>
            {item.text} <button onClick={() => handleDelete(idx)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newItem}
        placeholder="Add new item..."
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button className="add-btn" onClick={handleAdd}>Add</button>
    </section>
  );
}
