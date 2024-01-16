import BlogPost from '../../components/BlogPost';
import { loadContentfulEntryById } from '@/api/load-entries';
import { isAdmin } from '..';
import Link from 'next/link';

const BlogPostPage = (props) => {
  const entryData = props?.entryData;

  if (!entryData) {
    return null;
  }

  return (
    <div>
      <Link href={'/'}>Back home!!</Link>
      <BlogPost
        title={entryData.title}
        content={entryData.textContent}
        slug={entryData.id}
        publishedAt={entryData.publishedAt}
        updatedAt={entryData.updatedAt}
      />
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const slug = query.slug;

  try {
    const entryData = await loadContentfulEntryById(isAdmin, slug);

    return {
      props: {
        entryData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        entryData: null,
      },
    };
  }
}

export default BlogPostPage;
