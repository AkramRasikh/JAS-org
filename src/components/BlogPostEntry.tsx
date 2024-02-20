import React, { useEffect, useState } from 'react';

const BlogPostEntry = ({
  id,
  createBlogPost,
  updateBlogPost,
  preTitle,
  preRichContent,
  titleMinLength,
  titleMaxLength,
}) => {
  const isAnEdit = Boolean(id && (preTitle || preRichContent));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (preTitle || preRichContent) {
      setContent(preRichContent);
      setTitle(preTitle);
    }
  }, []);

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

    isAnEdit
      ? await updateBlogPost({ entryId: id, title, content })
      : await createBlogPost({ title, content });
  };

  const disableSubmit = !title?.trim() || !content?.trim;

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
          minLength={titleMinLength || 0}
          maxLength={titleMaxLength || Infinity}
        />
        {titleMaxLength && (
          <span style={{ color: 'gray' }}>
            {title.length}/{titleMaxLength} characters
          </span>
        )}
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

      <button type='submit' disabled={disableSubmit}>
        Submit
      </button>
    </form>
  );
};

export default BlogPostEntry;
