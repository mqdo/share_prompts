"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const userId = useParams().id;
  const userName = useSearchParams().get("name");
  const router = useRouter();

  if (session?.user?.id === userId) return router.push("/profile");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();

      setPosts(data);
    }

    if (userId) fetchPosts();
  }, [userId]);

  return (
    <Profile
      name={userName + "'s"}
      desc={`Welcome to ${userName}'s personalized profile page`}
      data={posts}
    />
  )
}

export default MyProfile