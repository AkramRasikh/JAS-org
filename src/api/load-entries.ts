import {
  contentfulClient,
  contentfulManagementClient,
} from '@/utils/contentful';

const getEntriesAdmin = async () => {
  const space = await contentfulManagementClient.getSpace(
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  );
  const environment = await space.getEnvironment('master');
  const { items } = await environment.getEntries();

  return items;
};
const getEntryByIdAdmin = async (id) => {
  const space = await contentfulManagementClient.getSpace(
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  );
  const environment = await space.getEnvironment('master');
  const entry = await environment.getEntry(id);

  return entry;
};

const getEntriesViewer = async () => {
  const { items } = await contentfulClient.getEntries({
    content_type: 'blogPost',
  });

  return items;
};
const getEntryByIdViewer = async (id) => {
  const entry = await contentfulClient.getEntry(id);

  return entry;
};

export const loadContentfulEntryById = async (isAdmin: boolean = true, id) => {
  const entry = isAdmin
    ? await getEntryByIdAdmin(id)
    : await getEntryByIdViewer(id);

  const title = isAdmin ? entry.fields.title['en-US'] : entry.fields.title;

  const textContent = isAdmin
    ? entry.fields.richText['en-US'].content[0].content[0].value
    : entry.fields.richText.content.map((nestedRichText) => {
        const textNode = nestedRichText.content[0];
        const textContent = textNode ? textNode.value : '';

        return textContent;
      });

  return {
    id: entry.sys.id,
    title,
    textContent,
    publishedAt:
      isAdmin && entry.sys?.publishedAt ? entry.sys.publishedAt : undefined, // take over isPublished
    updatedAt:
      isAdmin && entry.sys?.updatedAt ? entry.sys.updatedAt : undefined,
    createdAt: isAdmin ? entry.sys.createdAt : undefined,
  };
};

const loadContentfulEntries = async (isAdmin: boolean = true) => {
  const items = isAdmin ? await getEntriesAdmin() : await getEntriesViewer();
  return items;
};

export const getBlogContentTypes = async () => {
  try {
    const space = await contentfulManagementClient.getSpace(
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    );
    const environment = await space.getEnvironment('master');

    const contentTypes = await environment.getContentTypes();

    const blogPostContentType = contentTypes.items.find(
      (contentType) => contentType.name === 'Blog Post',
    );

    const blogContentFields = blogPostContentType.fields;
    const titleField = blogContentFields.find((field) => field.id === 'title');
    const blogTextField = blogContentFields.find(
      (field) => field.id === 'richText',
    );

    return {
      title: {
        validation: titleField?.validations,
        required: titleField?.required,
      },
      richText: {
        validation: blogTextField?.validations,
        required: blogTextField?.required,
      },
    };
  } catch (error) {
    console.error('Error retrieving content types:', error);
  }
};

export default loadContentfulEntries;
