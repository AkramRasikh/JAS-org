import { loadContentfulEntryByIdExp } from '@/api/load-entries';
import NodeTypeRenderer, {
  MarkerWrapper,
  TextMarker,
} from '@/utils/nodeTypeMapping/NodeTypeRenderer';
import Link from 'next/link';

const BlogPostPageExp = (props) => {
  const entryData = props?.entryData;

  if (!entryData) {
    return null;
  }

  const content = entryData.textContent['en-US'].content;
  console.log('## content: ', entryData.textContent['en-US'].content);

  return (
    <div>
      <Link href={'/'}>Back home!!</Link>
      <div>
        <h1>content mapped</h1>
        <ul>
          {content.map((contentWidget, index) => {
            const nestedContent = contentWidget.content;
            return (
              <li key={index}>
                <div>
                  <NodeTypeRenderer nodeType={contentWidget.nodeType}>
                    {nestedContent?.map(
                      (nestedContentWidget, secondaryIndex) => {
                        const nestedContentWidgetValue =
                          nestedContentWidget.value;
                        const nestedContentWidgetNodeType =
                          nestedContentWidget.nodeType;

                        if (nestedContentWidget.value) {
                          // still need to account for marks

                          return (
                            <MarkerWrapper
                              key={secondaryIndex}
                              value={nestedContentWidget.value}
                              marks={nestedContentWidget.marks}
                            />
                          );
                        }

                        return (
                          <TextMarker
                            key={secondaryIndex}
                            data={nestedContentWidget?.data}
                            nodeType={nestedContentWidgetNodeType}
                            content={nestedContentWidget?.content}
                            value={nestedContentWidget.value}
                          >
                            {nestedContentWidgetValue}
                          </TextMarker>
                        );
                      },
                    )}
                  </NodeTypeRenderer>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const slug = query.slug;

  try {
    const entryData = await loadContentfulEntryByIdExp(true, slug);

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

export default BlogPostPageExp;
