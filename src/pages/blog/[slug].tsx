import BlogPost from '../../components/BlogPost';
import { loadContentfulEntryById } from '@/api/load-entries';
import { isAdmin } from '..';
import Link from 'next/link';
import NodeTypeRenderer from '@/utils/nodeTypeMapping/NodeTypeRenderer';

const BlogPostPage = (props) => {
  const entryData = props?.entryData;

  const jsxReadyText = entryData.jsxTextContent.map((text, index) => {
    const nodeType = text.nodeType;

    const content = text.content;
    if (content.length === 1) {
      return (
        <NodeTypeRenderer key={index} nodeType={nodeType}>
          {content[0].value}
        </NodeTypeRenderer>
      );
    }

    // could be hyperlink for example
    return (
      <NodeTypeRenderer key={index} nodeType={nodeType}>
        {content.map((contentItem, indexNested) => {
          return (
            <NodeTypeRenderer
              key={indexNested}
              nodeType={contentItem.nodeType}
              {...contentItem}
            >
              {contentItem.value}
            </NodeTypeRenderer>
          );
        })}
      </NodeTypeRenderer>
    );
  });
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
        archivedAt={entryData.archivedAt}
        authorName={entryData?.authorName}
      />
      {jsxReadyText?.map((text) => text)}
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
