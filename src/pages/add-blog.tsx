import BlogPostEntry from '@/components/BlogPostEntry';
import { contentfulManagementClient } from '@/utils/contentful';
import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { isAdmin } from '.';
import { getBlogContentTypes } from '@/api/load-entries';

const AddBlogPage = (props) => {
  const titleValidation = props.validationRules.title;

  const titleSizeValidation = titleValidation.validation.find(
    (rule) => rule.size,
  );

  const router = useRouter();

  useEffect(() => {
    // If user is not an admin, redirect them to another page
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  const createBlogPost = async ({ title, content }) => {
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
        },
      });

      console.log('Blog post created:', entry);
      router.push({
        pathname: '/',
        query: { created: 'true' },
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <h1>Add Blog post</h1>
      <BlogPostEntry
        createBlogPost={createBlogPost}
        titleMinLength={titleSizeValidation.size.min}
        titleMaxLength={titleSizeValidation.size.max}
      />
    </div>
  );
};

export async function getStaticProps() {
  try {
    const validationRules = await getBlogContentTypes();

    console.log('## validationRules: ', JSON.stringify(validationRules));

    return {
      props: {
        validationRules,
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

export default AddBlogPage;
