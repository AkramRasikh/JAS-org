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

export default loadContentfulEntries;
