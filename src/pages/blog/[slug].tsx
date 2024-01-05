import { useRouter } from 'next/router';
import BlogPost from '../../components/BlogPost';

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const blogPost = {
    title: 'Sample Blog Post',
    content: 'This is the content of the sample blog post.',
  };

  return <BlogPost title={blogPost.title} slug={slug} />;
};

export default BlogPostPage;
