import { DiscussionEmbed } from 'disqus-react';

const DisqusComments = ({ slug, title }) => {
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME as string;

  const disqusConfig = {
    identifier: slug.toLowerCase(),
    title: title,
    url: `${process.env.NEXT_PUBLIC_DISQUS_URL}/blog/${slug}`,
  };

  return <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />;
};

const BlogPost = ({ title, content, slug }) => {
  if (!slug || !title) {
    return null;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <DisqusComments slug={slug} title={title} />
    </div>
  );
};

export default BlogPost;
