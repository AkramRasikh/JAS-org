import { isAdmin } from '@/pages';
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

export const getEntriesOnLanding = async () => {
  const items = await getEntriesAdmin();

  const contentfulData = await Promise.all(
    items.map(async (item) => {
      const title = isAdmin ? item.fields.title['en-US'] : item.fields.title;

      let author = null;

      if (item.fields?.author) {
        try {
          const authorDetails = await getAuthorByIdAdmin(
            item.fields.author['en-US'].sys.id,
          );
          author = authorDetails.fields.name['en-US'];
        } catch (error) {
          console.log('## couldnt get authors name');
        }
      }

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
        publishedAt: item.sys.publishedAt || null, // take over isPublished
        createdAt: isAdmin ? item.sys.createdAt : null,
        updatedAt: isAdmin ? item.sys.updatedAt : null,
        archivedAt:
          isAdmin && item.sys?.archivedAt ? item.sys.archivedAt : null,
        author,
      };
    }),
  );

  return contentfulData;
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

export const loadContentfulEntryByIdExp = async (
  isAdmin: boolean = true,
  id,
) => {
  const entry = isAdmin
    ? await getEntryByIdAdmin(id)
    : await getEntryByIdViewer(id);

  const textContent = entry.fields.richText;

  return {
    textContent,
  };
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

export const getAuthorContentTypes = async () => {
  try {
    const environment = await getSpaceAndEnv();
    const contentTypes = await environment.getContentTypes();

    const authorContentType = contentTypes.items.find(
      (contentType) => contentType.name === 'author',
    );

    const authorFields = authorContentType.fields;

    const nameField = authorFields.find((field) => field.name === 'name');

    return {
      name: {
        validation: nameField?.validations,
        required: nameField?.required,
      },
    };
  } catch (error) {
    console.error('Error retrieving content types:', error);
  }
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
