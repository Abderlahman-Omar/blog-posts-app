import { useEffect, useState } from 'react';
import { useGetSettingsQuery } from './Api/BlogSlice'
import './App.css'
import type { Post } from './types';
function App() {
  const {data} = useGetSettingsQuery()
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  useEffect(() => {
    setFilteredPosts(data?.articles || []);
}, [data]);
  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const trimmedValue = value.trim()
    if (trimmedValue !== "") {
      setFilteredPosts(
        data?.articles?.filter(
          (currency: Post) =>
            currency.author?.toLowerCase().includes(trimmedValue.toLowerCase()
          )
        )
      );
    } else {
      setFilteredPosts(data?.articles)
    }
};
  return (
    <>
      <div>
      <input
        onChange={search}
        value={searchTerm}
        placeholder={"search"}
        className="h-[44px] w-full px-[40px] py-[10px] pl-[36px] focus:ring-0 border rounded-[8px]"
        type="search"
        autoFocus
    />
        {filteredPosts.map((post,index:number) => (
          <div key={index}>
            {post.author}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
