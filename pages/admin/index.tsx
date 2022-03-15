import AuthCheck from 'components/AuthCheck';
import PostList from 'components/admin/PostList';
import CreateNewPost from 'components/admin/CreateNewPost';

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}
