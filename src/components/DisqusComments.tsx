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

export default DisqusComments;
