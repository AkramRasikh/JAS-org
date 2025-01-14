import { createClient } from 'contentful';
import { createClient as createContentfulManagementClient } from 'contentful-management';

const contentfulManagementClient = createContentfulManagementClient({
  accessToken: process.env
    .NEXT_PUBLIC_CONTENTFUL_PERSONAL_ACCESS_TOKEN as string,
});

const contentfulClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
});

export { contentfulClient, contentfulManagementClient };
