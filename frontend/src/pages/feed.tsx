// import { StoriesBar } from "@/features/feed/components/StoriesBar";
import { PostComposer } from "@/features/feed/components/PostComposer";
import { PostCard } from "@/features/feed/components/PostCard";
import { mockPosts } from "@/features/feed/data";

const FeedPage = () => {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
      {/* <StoriesBar /> */}
      <PostComposer />
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedPage;
