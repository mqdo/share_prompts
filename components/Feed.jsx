"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import debounce from "@utils/debounce";
import { useSearchParams } from "next/navigation";

const PromptCardList = ({ data }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  )
}

const handleSearch = async (text, setPosts) => {
  const response = await fetch(`/api/prompt?query=${text}`);
  const data = await response.json();

  setPosts(data);
}

const debounceSearch = debounce(handleSearch);

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const query = useSearchParams().get("search");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debounceSearch(e.target.value, setPosts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const url = query
        ? `/api/prompt?query=${query}`
        : "/api/prompt"
      const response = await fetch(url);
      const data = await response.json();

      setPosts(data);
    }

    fetchPosts();
  }, [query]);

  useEffect(() => {
    if (query) setSearchText(query);
  }, [query])

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          required
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} />
    </section>
  )
}

export default Feed