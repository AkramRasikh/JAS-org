import { isAdmin } from '@/pages';
import DisqusComments from './DisqusComments';

// Options for formatting the date
const options = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const BlogPost = ({ title, content, slug, publishedAt, updatedAt }) => {
  if (!slug || !title) {
    return null;
  }

  let updatedAtDateObject;
  let formattedUpdatedDate;
  const hasBeenUpdated = updatedAt === publishedAt;

  const publishedDateObject = new Date(publishedAt);

  if (hasBeenUpdated) {
    updatedAtDateObject = new Date(updatedAt);
    formattedUpdatedDate = updatedAtDateObject.toLocaleString('en-US', options);
  }

  // Format the Date object into a readable string
  const formattedPublishedDate = publishedDateObject.toLocaleString(
    'en-US',
    options,
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <DisqusComments slug={slug} title={title} />
      <p>Published: {formattedPublishedDate}</p>
      {isAdmin && hasBeenUpdated && (
        <>
          <p>Last edited: {formattedPublishedDate}</p>
        </>
      )}
    </div>
  );
};

export default BlogPost;
