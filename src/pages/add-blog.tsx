import BlogPostEntry from '@/components/BlogPostEntry';
import { contentfulManagementClient } from '@/utils/contentful';
import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { isAdmin } from '.';
import { getAuthorContentTypes, getBlogContentTypes } from '@/api/load-entries';

const AddBlogPage = (props) => {
  const titleValidation = props.blogValidationRules.title;
  const authorValidation = props.authorValidationRules.name;

  const titleSizeValidation = titleValidation.validation.find(
    (rule) => rule.size,
  );
  const authorSizeValidation = authorValidation.validation.find(
    (rule) => rule.size,
  );

  const router = useRouter();

  useEffect(() => {
    // If user is not an admin, redirect them to another page
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  const createBlogPost = async ({ title, content, authorEntryId }) => {
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
        authorMaxLength={authorSizeValidation.size.max}
        // no need for min since it is optional
      />
    </div>
  );
};

export async function getStaticProps() {
  try {
    const validationRules = await getBlogContentTypes();
    const validationRulesAuthor = await getAuthorContentTypes();

    return {
      props: {
        blogValidationRules: validationRules,
        authorValidationRules: validationRulesAuthor,
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
