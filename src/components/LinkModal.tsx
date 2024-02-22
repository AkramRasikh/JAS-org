import React, { useState } from 'react';

const LinkModal = () => {
  const [linkText, setLinkText] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const isSubmitDisabled = linkText === '' || linkTarget === '';

  const handleLinkTextChange = (e) => {
    setLinkText(e.target.value);
  };

  const handleLinkTargetChange = (e) => {
    setLinkTarget(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // add logic here
  };

  return (
    <div
      style={{
        border: '2px solid black',
        width: 'fit-content',
        padding: '5px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <label>
          Link Text:
          <input type='text' value={linkText} onChange={handleLinkTextChange} />
        </label>
        <br />
        <label>
          Link Target:
          <input
            type='text'
            value={linkTarget}
            onChange={handleLinkTargetChange}
          />
        </label>
        <br />
        <button type='submit' disabled={isSubmitDisabled}>
          Insert
        </button>
      </form>
    </div>
  );
};

export default LinkModal;
