import React from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, id, required = false }) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="input-wrapper">
        <input
          id={id}
          type={type}
          className="custom-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default InputField;
