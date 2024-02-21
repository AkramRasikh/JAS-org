import { contentfulManagementClient } from '@/utils/contentful';

export const createAuthorAPI = async (name: string) => {
  try {
    const space = await contentfulManagementClient.getSpace(
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    );
    const environment = await space.getEnvironment('master');

    const authorEntry = await environment.createEntry('author', {
      fields: {
        name: { 'en-US': name },
      },
    });

    console.log('Author created:', authorEntry);
    return authorEntry.sys.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
  }
};
