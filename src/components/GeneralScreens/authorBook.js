import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../Context/AuthContext";
import instance from "../../Context/axiosConfig";
import "../../Css/AuthorBooksScreen.css";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import BookReadTime from "../utilities/book_readtime";
import Pagination from "../GeneralScreens/Pagination";
import { ALLOWED_TAGS as TAGS } from "../utilities/story_constants";

const AuthorBooksScreen = () => {
  const { activeUser } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10); // Number of items per page
  const navigate = useNavigate();

  const fetchAuthorBooks = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setProgress(0);

        const tagQuery = TAGS.join("+");
        const response = await instance.get(
          `story/getAllStories/${tagQuery}?author=${activeUser.username}&page=${page}&limit=${pageSize}`
        );

        const simulateProgress = setInterval(() => {
          setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
        }, 100);

        setTimeout(() => {
          clearInterval(simulateProgress);
          setBooks(response.data.data);
          setTotalPages(response.data.pages);
          setLoading(false);
          setProgress(100);

          // Maintain backward compatibility by storing only the data array
          localStorage.setItem(
            "authorBooks",
            JSON.stringify(response.data.data)
          );
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch author books:", error);
        setLoading(false);
      }
    },
    [activeUser.username, pageSize]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAuthorBooks(page);
    // Scroll to top of the page when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditBook = (bookId) => {
    navigate(`/story/${bookId}/edit`);
  };

  useEffect(() => {
    if (activeUser.username) {
      // Load cached data with backward compatibility
      const cachedData = localStorage.getItem("authorBooks");
      if (cachedData) {
        try {
          // Just set the books data directly from cache
          const parsedData = JSON.parse(cachedData);
          setBooks(parsedData);
        } catch (error) {
          console.error("Error parsing cached data:", error);
        }
      }
      // Always fetch fresh data when component mounts or page changes
      fetchAuthorBooks(currentPage);
    }
  }, [activeUser.username, currentPage, fetchAuthorBooks]);

  return (
    <div className="author-books-container">
      {loading && (
        <div className="progress-overlay">
          <div className="progress-card">
            <div className="progress-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="refresh-icon"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1-2.12-9.36L23 10"></path>
              </svg>
              <span>Refreshing</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="books-grid">
        {books?.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-image-container">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-image"
                  onClick={() => handleEditBook(book.slug)}
                />
              ) : (
                <div className="book-image-placeholder">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="placeholder-icon"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
              )}
            </div>

            <div className="book-content">
              <h2 className="book-title">{book.title}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    book.summary.length > 250
                      ? book.summary.slice(0, 250) + "..."
                      : book.summary
                  ),
                }}
              />

              <div className="book-meta">
                <div className="book-rating">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="rating-icon"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{book.averageRating?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="book-read-time">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <BookReadTime readTime={book.readTime || []} />
                </div>
              </div>

              <div className="book-tags">
                {book.tags.map((tag) => (
                  <span key={tag} className="book-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {books?.length === 0 && !loading && (
        <div className="no-books-message">No books found for this author.</div>
      )}

      {totalPages > 0 && (
        <div className="pagination-container">
          <Pagination
            page={currentPage}
            pages={totalPages}
            changePage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AuthorBooksScreen;