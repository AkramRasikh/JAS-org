import BlogPostEntry from '@/components/BlogPostEntry';
import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { isAdmin } from '.';
import { getAuthorContentTypes, getBlogContentTypes } from '@/api/load-entries';
import { createBlogPost } from '@/api/blog-entry';

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
