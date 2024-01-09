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

const getEntriesViewer = async () => {
  const { items } = await contentfulClient.getEntries({
    content_type: 'blogPost',
  });

  return items;
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
