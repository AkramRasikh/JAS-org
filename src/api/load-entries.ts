import {
  contentfulClient,
  contentfulManagementClient,
} from '@/utils/contentful';

const getSpaceAndEnv = async () => {
  const space = await contentfulManagementClient.getSpace(
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  );
  const environment = await space.getEnvironment('master');
  return environment;
};

const getEntriesAdmin = async () => {
  const environment = await getSpaceAndEnv();
  const { items } = await environment.getEntries({ content_type: 'blogPost' });

  return items.filter((item) => Object.keys(item.fields).length !== 0);
};
const getEntryByIdAdmin = async (id) => {
  const environment = await getSpaceAndEnv();
  const entry = await environment.getEntry(id);
  return entry;
};

const getAuthorByIdAdmin = async (id) => {
  const environment = await getSpaceAndEnv();
  const entry = await environment.getEntry(id);
  return entry;
};

const getEntriesViewer = async () => {
  const { items } = await contentfulClient.getEntries({
    content_type: 'blogPost',
  });

  return items.filter((item) => Object.keys(item.fields).length !== 0);
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

  let authorName = null;

  if (!isAdmin && entry.fields?.author) {
    authorName = entry.fields?.author.fields.name;
  } else if (entry.fields?.author && entry.fields?.author['en-US']) {
    const authorDetails = await getAuthorByIdAdmin(
      entry.fields.author['en-US'].sys.id,
    );
    authorName = authorDetails.fields.name['en-US'];
  }

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
    authorName,
    publishedAt:
      isAdmin && entry.sys?.publishedAt
        ? entry.sys.publishedAt
        : entry.sys.createdAt, // take over isPublished
    updatedAt: isAdmin && entry.sys?.updatedAt ? entry.sys.updatedAt : null,
    createdAt: isAdmin ? entry.sys.createdAt : null,
    jsxTextContent: isAdmin
      ? entry.fields.richText['en-US'].content
      : entry.fields.richText.content,
    archivedAt: entry.sys?.archivedAt || null,
  };
};

const loadContentfulEntries = async (isAdmin: boolean = true) => {
  const items = isAdmin ? await getEntriesAdmin() : await getEntriesViewer();
  return items;
};

export const getBlogContentTypes = async () => {
  try {
    const environment = await getSpaceAndEnv();
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
