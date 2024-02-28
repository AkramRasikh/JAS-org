import React, { useEffect, useState } from 'react';

const LinkModal = ({ prelinkText, setOverrideOpen }) => {
  const [linkText, setLinkText] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const isSubmitDisabled = linkText === '' || linkTarget === '';

  useEffect(() => {
    setLinkText(prelinkText);
  }, []);

  const handleLinkTextChange = (e) => {
    setLinkText(e.target.value);
  };

  const handleLinkTargetChange = (e) => {
    setLinkTarget(e.target.value);
  };

  const handleOverrideClose = () => {
    setOverrideOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOverrideOpen(false);
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
      <button onClick={handleOverrideClose}>
        <span>❌</span>
      </button>
      <form>
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
        <button
          type='submit'
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Insert
        </button>
      </form>
    </div>
  );
};

export default LinkModal;
