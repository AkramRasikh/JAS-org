import loadContentfulEntries from '@/api/load-entries';
import { contentfulManagementClient } from '../utils/contentful';
import Link from 'next/link';
import BlogPostEntry from '@/components/BlogPostEntry';

export const isAdmin = true;

const Home = (props) => {
  const contentfulData = props?.items.map((item) => {
    const title = isAdmin ? item.fields.title['en-US'] : item.fields.title;

    const textContent = isAdmin
      ? item.fields.richText['en-US'].content[0].content[0].value
      : item.fields.richText.content.map((nestedRichText) => {
          const textNode = nestedRichText.content[0];
          const textContent = textNode ? textNode.value : '';

          return textContent;
        });

    return {
      id: item.sys.id,
      title,
      textContent,
      isArchived: isAdmin && item.sys.archivedAt !== undefined,
      publishedAt: item.sys.publishedAt, // take over isPublished
      createdAt: isAdmin ? item.sys.createdAt : undefined,
      updatedAt: isAdmin ? item.sys.updatedAt : undefined,
      archivedAt: isAdmin ? item.sys.archivedAt : undefined,
    };
  });

  const publishEntryById = async (entryId) => {
    try {
      // Fetch the entry using the Contentful Management API
      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry(entryId);

      // Check if the entry is already published
      if (!entry.isPublished()) {
        // If not published, publish the entry
        const publishedEntry = await entry.publish();
        console.log('Entry published successfully:', publishedEntry);
        return publishedEntry;
      } else {
        console.log('Entry is already published');
        return entry;
      }
    } catch (error) {
      console.error('Error publishing entry:', error);
      throw error;
    }
  };

  const unpublishEntryById = async (entryId) => {
    try {
      // Fetch the entry using the Contentful Management API
      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry(entryId);

      // Check if the entry is published
      if (entry.isPublished()) {
        // If published, unpublish the entry
        const unpublishedEntry = await entry.unpublish();
        console.log('Entry unpublished successfully:', unpublishedEntry);
        return unpublishedEntry;
      } else {
        console.log('Entry is not published');
        return entry;
      }
    } catch (error) {
      console.error('Error unpublishing entry:', error);
      throw error;
    }
  };

  const deleteEntryById = async (entryId) => {
    try {
      // Use the Content Management API to delete the entry
      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry(entryId);
      const deletedEntry = await entry.delete();

      console.log('Entry deleted successfully:', deletedEntry);
      return deletedEntry;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };
  const updateContentfulEntry = async ({ entryId, title, content }) => {
    try {
      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry(entryId);

      entry.fields = {
        ...entry.fields,
        title: { 'en-US': title },
        richText: {
          'en-US': {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value: content,
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
      };

      // Save the changes
      await entry.update();
      console.log('Entry updated successfully.');
    } catch (error) {
      console.error('Error updating Contentful entry:', error);
    }
  };

  const archiveEntryById = async (entryId) => {
    try {
      // Fetch the entry using the Contentful Management API
      const entry = await contentfulManagementClient
        .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string)
        .then((space) => space.getEnvironment('master'))
        .then((environment) => environment.getEntry(entryId));

      // Check if the entry is not already archived
      console.log('## entry.isArchived: ', entry.isArchived());

      if (!entry.isArchived()) {
        // If not archived, archive the entry
        const archivedEntry = await entry.archive();
        console.log('Entry archived successfully:', archivedEntry);
        return archivedEntry;
      } else {
        console.log('Entry is already archived');
        return entry;
      }
    } catch (error) {
      console.error('Error archiving entry:', error);
      throw error;
    }
  };

  const unarchiveEntryById = async ({ entryId }) => {
    try {
      // Fetch the entry using the Contentful Management API
      const entry = await contentfulManagementClient
        .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string)
        .then((space) => space.getEnvironment('master'))
        .then((environment) => environment.getEntry(entryId));

      // Check if the entry is archived
      if (entry.isArchived()) {
        // If archived, unarchive the entry
        const unarchivedEntry = await entry.unarchive();
        console.log('Entry unarchived successfully:', unarchivedEntry);
        return unarchivedEntry;
      } else {
        console.log('Entry is not archived');
        return entry;
      }
    } catch (error) {
      console.error('Error unarchiving entry:', error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Justice Africa Sudan</h1>
      <div>
        {contentfulData?.map((contentfuObj) => {
          const isPublished = Boolean(contentfuObj.publishedAt);
          const isArchived = Boolean(contentfuObj.isArchived);

          return (
            <div key={contentfuObj.id}>
              <h1>{contentfuObj.title}</h1>
              {isAdmin && (
                <>
                  <button
                    onClick={() => updateContentfulEntry(contentfuObj.id)}
                  >
                    Update entry
                  </button>
                  <button onClick={() => deleteEntryById(contentfuObj.id)}>
                    Delete entry
                  </button>
                  <span>isPublished: {isPublished ? <>✅</> : <>❌</>}</span>
                  <span>isArchived: {isArchived ? <>✅</> : <>❌</>}</span>

                  <div>
                    {isPublished ? (
                      <button
                        onClick={() => unpublishEntryById(contentfuObj.id)}
                      >
                        Unpublish entry
                      </button>
                    ) : (
                      <button onClick={() => publishEntryById(contentfuObj.id)}>
                        Publish entry
                      </button>
                    )}
                    {isArchived ? (
                      <button
                        onClick={() => unarchiveEntryById(contentfuObj.id)}
                      >
                        Unarchive entry
                      </button>
                    ) : (
                      <button onClick={() => archiveEntryById(contentfuObj.id)}>
                        Archive entry
                      </button>
                    )}
                  </div>
                  <BlogPostEntry
                    id={contentfuObj.id}
                    updateBlogPost={updateContentfulEntry}
                    preTitle={contentfuObj.title}
                    preRichContent={contentfuObj.textContent}
                  />
                </>
              )}

              <Link href={`/blog/${contentfuObj.id}`}>
                Continue reading blog!
              </Link>
            </div>
          );
        })}
      </div>
      {isAdmin && <Link href={'/add-blog'}>Add blog entry</Link>}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const items = await loadContentfulEntries(isAdmin);

    return {
      props: {
        items,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        items: [],
      },
    };
  }
}

export default Home;
