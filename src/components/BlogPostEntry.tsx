import { createAuthorAPI } from '@/api/author';
import React, { useEffect, useState } from 'react';
import LinkModal from './LinkModal';

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
  const [openLinkModal, setOpenLinkModal] = useState(false);

  const [isTextHighlighted, setIsTextHighlighted] = useState('');

  const handleHyperlinkClick = () => {
    setOpenLinkModal(!openLinkModal);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setIsTextHighlighted(selection.toString());
      } else {
        setIsTextHighlighted('');
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
  const handleOverrideClose = () => {
    setIsTextHighlighted('');
    setOpenLinkModal(false);
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
    <div>
      {openLinkModal && (
        <LinkModal
          prelinkText={isTextHighlighted}
          setOverrideOpen={handleOverrideClose}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <button onClick={handleHyperlinkClick}>
            <span>🔗</span>
          </button>
        </div>
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
    </div>
  );
};

export default BlogPostEntry;
