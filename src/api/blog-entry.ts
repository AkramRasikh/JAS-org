import { contentfulManagementClient } from '@/utils/contentful';
import Router from 'next/router';

export const createBlogPost = async ({ title, content, authorEntryId }) => {
  try {
    const space = await contentfulManagementClient.getSpace(
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    );
    const environment = await space.getEnvironment('master');

    // Create a new entry
    const entry = await environment.createEntry('blogPost', {
      fields: {
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
        author: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: authorEntryId, // ID of the author entry you want to link
            },
          },
        },
      },
    });

    console.log('Blog post created:', entry);
    Router.push({
      pathname: '/',
      query: { created: 'true' },
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
  }
};

export const updateContentfulEntry = async ({
  entryId,
  title,
  content,
  authorEntryId,
}) => {
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
      author: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: authorEntryId, // ID of the author entry you want to link
          },
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
