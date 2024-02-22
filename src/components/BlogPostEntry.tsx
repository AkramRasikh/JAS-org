import { createAuthorAPI } from '@/api/author';
import React, { useEffect, useState } from 'react';

const BlogPostEntry = ({
  id,
  createBlogPost,
  updateBlogPost,
  preTitle,
  preRichContent,
  titleMinLength,
  titleMaxLength,
  authorMaxLength,
  preAuthor,
}) => {
  const isAnEdit = Boolean(id && (preTitle || preRichContent));

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (preTitle || preRichContent || preAuthor) {
      setContent(preRichContent);
      setTitle(preTitle);
      setAuthor(preAuthor);
    }
    if (preAuthor) {
      setAuthor(preAuthor);
    }
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
    setError('');
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let authorEntryId;
    if (author?.trim()) {
      authorEntryId = await createAuthorAPI(author);
    }

    // Check for empty fields
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    isAnEdit
      ? await updateBlogPost({ entryId: id, title, content, authorEntryId }) // need to add authorEntryId
      : await createBlogPost({ title, content, authorEntryId });
  };

  const disableSubmit = !title?.trim() || !content?.trim();

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
      <div>
        <label htmlFor='author'>Author:</label>
        <input
          type='text'
          id='author'
          name='author'
          value={author}
          onChange={handleAuthorChange}
          maxLength={authorMaxLength || Infinity}
        />
        {authorMaxLength && (
          <div>
            <span style={{ color: 'gray' }}>
              {author.length}/{authorMaxLength} characters
            </span>
            <span>Remember, this field is optional</span>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type='submit' disabled={disableSubmit}>
        Submit
      </button>
    </form>
  );
};

export default BlogPostEntry;
