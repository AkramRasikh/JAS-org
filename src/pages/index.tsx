import loadContentfulEntries from '@/api/load-entries';
import { contentfulManagementClient } from '../utils/contentful';

const Home = (props) => {
  const ids = props?.items.map((item) => ({
    id: item.sys.id,
    isPublished: item.sys.publishedAt,
    isArchived: item.sys.archivedAt !== undefined,
  }));

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
  const updateContentfulEntry = async (entryId) => {
    try {
      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry(entryId);

      entry.fields = {
        ...entry.fields,
        title: { 'en-US': 'This rasss draft! (Edited!!)' },
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
                    value: 'Yah dun kno!!!',
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
  const createBlogPost = async () => {
    try {
      // Get the space

      const space = await contentfulManagementClient.getSpace(
        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
      );
      const environment = await space.getEnvironment('master');

      console.log('## space: ', space);

      // Create a new entry
      const entry = await environment.createEntry('blogPost', {
        fields: {
          title: { 'en-US': 'This rasss draft!' },
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
                      value: 'Yah dun kno!!!',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      console.log('Blog post created:', entry);
    } catch (error) {
      console.error('Error creating blog post:', error);
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

  const unarchiveEntryById = async (entryId) => {
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
        {ids?.map((contentfulId) => {
          const isPublished = Boolean(contentfulId.isPublished);
          const isArchived = Boolean(contentfulId.isArchived);

          return (
            <div key={contentfulId}>
              <p>{contentfulId.id}</p>
              <button onClick={() => updateContentfulEntry(contentfulId.id)}>
                Update entry
              </button>
              <button onClick={() => deleteEntryById(contentfulId.id)}>
                Delete entry
              </button>
              <span>isPublished: {isPublished ? <>✅</> : <>❌</>}</span>
              <span>isArchived: {isArchived ? <>✅</> : <>❌</>}</span>
              <div>
                {isPublished ? (
                  <button onClick={() => unpublishEntryById(contentfulId.id)}>
                    Unpublish entry
                  </button>
                ) : (
                  <button onClick={() => publishEntryById(contentfulId.id)}>
                    Publish entry
                  </button>
                )}
                {isArchived ? (
                  <button onClick={() => unarchiveEntryById(contentfulId.id)}>
                    Unarchive entry
                  </button>
                ) : (
                  <button onClick={() => archiveEntryById(contentfulId.id)}>
                    Archive entry
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={createBlogPost}>Add entry</button>
    </div>
  );
};

export async function getStaticProps() {
  const isAdmin = false;

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
