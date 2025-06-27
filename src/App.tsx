import { useEffect, useState } from 'react';
import { useGetSettingsQuery } from './Api/BlogSlice';
import './App.css';
import type { Post } from './types';

function App() {
  const { data, isLoading, error } = useGetSettingsQuery();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    setFilteredPosts(data?.articles || []);
    setCurrentPage(1);
  }, [data]);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const trimmedValue = value.trim().toLowerCase();
    
    if (!data?.articles) return;
    
    setFilteredPosts(
      data.articles.filter((post: Post) => {
        const author = post.author || '';
        return author.toLowerCase().includes(trimmedValue);
      })
    );
    setCurrentPage(1);
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <input
        onChange={search}
        value={searchTerm}
        placeholder="Search by author"
        className="h-[44px] w-full px-[40px] py-[10px] pl-[36px] focus:ring-0 border rounded-[8px]"
        type="search"
        autoFocus
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading data</div>
      ) : (
        <>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Published At</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, index) => (
                  <tr key={index}>
                    <td>{post.author || 'Unknown'}</td>
                    <td>{post.title || 'No title'}</td>
                    <td>{post.content || 'No content'}</td>
                    <td>{post.publishedAt || 'Unknown date'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <div>No posts found</div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={currentPage === number ? 'active' : ''}
                >
                  {number}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;