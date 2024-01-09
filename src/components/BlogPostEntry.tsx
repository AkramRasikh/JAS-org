import React, { useState } from 'react';

const BlogPostEntry = ({ createBlogPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for empty fields
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    await createBlogPost(title, content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='title'>Title:</label>
        <input
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div>
        <label htmlFor='content'>Content:</label>
        <textarea
          id='content'
          name='content'
          value={content}
          onChange={handleContentChange}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type='submit'>Submit</button>
    </form>
  );
};

export default BlogPostEntry;
