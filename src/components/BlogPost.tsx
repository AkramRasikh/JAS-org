import { isAdmin } from '@/pages';
import DisqusComments from './DisqusComments';

const options = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const BlogPost = ({
  title,
  content,
  slug,
  publishedAt,
  updatedAt,
  authorName,
  archivedAt,
  createdAt,
}) => {
  if (!slug || !title) {
    return null;
  }

  let updatedAtDateObject;
  let formattedUpdatedDate;
  const hasBeenUpdated = updatedAt === publishedAt;

  const publishedDateObject = new Date(publishedAt);
  const createdAtDateObject = new Date(createdAt);

  if (hasBeenUpdated) {
    updatedAtDateObject = new Date(updatedAt);
    formattedUpdatedDate = updatedAtDateObject.toLocaleString('en-US', options);
  }

  // Format the Date object into a readable string
  const formattedPublishedDate = publishedDateObject.toLocaleString(
    'en-US',
    options,
  );
  const formattedCreatedAtDate = createdAtDateObject.toLocaleString(
    'en-US',
    options,
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <DisqusComments slug={slug} title={title} />
      <p>Published: {formattedCreatedAtDate}</p>
      {isAdmin && (
        <>
          <p>Date was created: {formattedCreatedAtDate}</p>
        </>
      )}
      {isAdmin && hasBeenUpdated && (
        <>
          <p>Last edited: {formattedPublishedDate}</p>
        </>
      )}
      {isAdmin && archivedAt && (
        <>
          <p>
            Archived at: {new Date(archivedAt).toLocaleString('en-US', options)}
            {/* not efficient */}
          </p>
        </>
      )}
      {authorName && <p>Author: {authorName}</p>}
    </div>
  );
};

export default BlogPost;
