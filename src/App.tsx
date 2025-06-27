import { useEffect, useState } from 'react';
import { useGetSettingsQuery } from './Api/BlogSlice';
import './App.css';
import type { Post } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

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
    <div className="app-container">
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          onChange={search}
          value={searchTerm}
          placeholder="Search by author..."
          className="search-input"
          type="search"
          autoFocus
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error loading data</div>
      ) : (
        <>
          <div className='table-wrapper'>
            <table className="data-table">
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
                    <td data-label="Author">{post.author || 'Unknown'}</td>
                    <td data-label="Title">{post.title || 'No title'}</td>
                    <td data-label="Content" className="content-cell">
                      {post.content || 'No content'}
                    </td>
                    <td data-label="Published">{post.publishedAt || 'Unknown date'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <div className="no-results">No posts found</div>
            )}
          </div>

          {filteredPosts.length > postsPerPage && (
            <div className="pagination-container">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;