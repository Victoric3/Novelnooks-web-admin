import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../Context/axiosConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../Css/enhancedBookEditor.css";
import { FaTrash, FaPlusCircle, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import { ALLOWED_TAGS } from "../utilities/story_constants";

const LOCAL_STORAGE_KEY = "currentBookDraft";

const AddBookEditor = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  // State management
  const [chapters, setChapters] = useState([]);
  const [changeIndicator, setChangeIndicator] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [collapsedChapters, setCollapsedChapters] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({
    metadata: false,
    chapters: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Form data states
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [contentTitles, setContentTitles] = useState([]);
  const [newContentTitle, setNewContentTitle] = useState('');

  // Initialize component with local storage or empty values
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setTitle(parsedDraft.title || "");
        setSummary(parsedDraft.summary || "");
        setTags(parsedDraft.tags || []);
        setImage(parsedDraft.image || null);
        setPreviewImage(parsedDraft.previewImage || null);
        setContentTitles(parsedDraft.contentTitles || []); 
        const initialChapters = parsedDraft.chapters?.length
          ? parsedDraft.chapters.map((chapter, index) => ({
              index,
              content: chapter.content || "",
              isEdited: true,
              originalIndex: index,
              placeholder:
                index === 0
                  ? "Write your preface here..."
                  : `Write content for Chapter ${index} here...`,
            }))
          : [createChapter(0, "Write your preface here...")];

        setChapters(initialChapters);

        // Initially collapse all chapters except first
        const initialCollapsedState = initialChapters.reduce((acc, chapter) => {
          acc[chapter.index] = chapter.index !== 0;
          return acc;
        }, {});
        setCollapsedChapters(initialCollapsedState);
      } else {
        // Initialize with empty content
        setChapters([createChapter(0, "Write your preface here...")]);
        setCollapsedChapters({ 0: false });
      }
    } catch (e) {
      setError("Error loading draft");
      // Fallback to empty initialization
      setChapters([createChapter(0, "Write your preface here...")]);
      setCollapsedChapters({ 0: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save draft to local storage whenever content changes
  useEffect(() => {
    const currentDraft = {
      title,
      summary,
      tags,
      image,
      previewImage,
      contentTitles,
      chapters: chapters.map((chapter) => ({
        content: chapter.content,
        originalIndex: chapter.originalIndex,
      })),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDraft));
  }, [title, summary, tags, image, previewImage, chapters, contentTitles]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    []
  );

  // Create a new chapter helper function
  const createChapter = (index, placeholder) => ({
    index,
    content: "",
    isEdited: true,
    originalIndex: index,
    placeholder: placeholder || `Write content for Chapter ${index} here...`,
  });

  // Toggle chapter collapse
  const toggleChapterCollapse = (index) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    setChangeIndicator(!changeIndicator);
  };

  const handleAddChapter = () => {
    const newChapterIndex = chapters.length;
    const newChapter = createChapter(
      newChapterIndex,
      `Write content for Chapter ${newChapterIndex} here...`
    );

    setChapters((prev) => [...prev, newChapter]);
    setChangeIndicator(!changeIndicator);

    // Ensure the new chapter is not collapsed
    setCollapsedChapters((prev) => ({
      ...prev,
      [newChapterIndex]: false,
    }));
  };

  const ChapterEditor = React.memo(
    ({ chapter, onChange, onDelete, isAddable = false }) => {
      const isCollapsed = collapsedChapters[chapter.index];

      return (
        <div className="chapter-editor-container">
          <div
            className="chapter-header"
            onClick={() => toggleChapterCollapse(chapter.index)}
          >
            <h3 className="chapter-title">
              {chapter.index === 0
                ? "Preface"
                : isAddable
                ? "New Chapter"
                : `Chapter ${chapter.originalIndex}`}
            </h3>
            <div className="chapter-controls">
              {!isAddable && (
                <FaTrash
                  className="chapter-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chapter.index);
                  }}
                />
              )}
              <span className="collapse-indicator">
                {isCollapsed ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <ReactQuill
              value={chapter.content}
              onChange={(value) => onChange(chapter.index, value)}
              modules={modules}
              placeholder={chapter.placeholder}
              theme="snow"
              className="chapter-quill-editor"
            />
          )}
        </div>
      );
    }
  );
    
  const handleChapterChange = useCallback((index, content) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.index === index
          ? { ...chapter, content, isEdited: true }
          : chapter
      )
    );
  }, []);

  const handleDeleteChapter = useCallback(
    (indexToDelete) => {
      setChapters((prev) =>
        prev
          .filter((chapter) => chapter.index !== indexToDelete)
          .map((chapter, index) => ({
            ...chapter,
            index: index,
          }))
      );
      setChangeIndicator(!changeIndicator);
    },
    [changeIndicator]
  );

  // Render chapter editors based on edit mode
  const renderChapterEditors = useCallback(() => {
    if (!chapters.length) return null;
    return chapters.map((chapter) => (
      <ChapterEditor
        key={chapter.index}
        chapter={chapter}
        onChange={handleChapterChange}
        onDelete={handleDeleteChapter}
      />
    ));
    // eslint-disable-next-line
  }, [changeIndicator]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (tagToAdd) => {
    if (tags.length >= 3) {
      setError(
        "A maximum of three tags is allowed. Please remove some tags before adding more."
      );
      return;
    }

    if (tagToAdd.trim() && !tags.includes(tagToAdd.trim())) {
      setTags([...tags, tagToAdd.trim()]);
      setNewTag("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Toggle section collapse
  const toggleSectionCollapse = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddContentTitle = () => {
    if (newContentTitle.trim() && !contentTitles.includes(newContentTitle.trim())) {
      setContentTitles(prev => [...prev, newContentTitle.trim()]);
      setNewContentTitle('');
    }
  };

  // Remove content title method
  const handleRemoveContentTitle = (titleToRemove) => {
    setContentTitles(prev => prev.filter(title => title !== titleToRemove));
  };

  const renderMetadataSection = () => {
    return (
      <div className="metadata-section">
        <div
          className="section-header"
          onClick={() => toggleSectionCollapse("metadata")}
        >
          <h2>Book Metadata</h2>
          {collapsedSections.metadata ? (
            <IoMdArrowDropdown />
          ) : (
            <IoMdArrowDropup />
          )}
        </div>

        {!collapsedSections.metadata && (
          <div className="metadata-content">
            {/* Title Editing */}
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                className="title-input"
              />
            </div>

            {/* Summary Editing with Rich Text Editor */}
            <div className="form-group">
              <label>Book Summary</label>
              <ReactQuill
                value={summary}
                onChange={setSummary}
                modules={modules}
                theme="snow"
                placeholder="Write a brief summary of your book"
                className="summary-quill-editor"
              />
            </div>

            {/* Tags Editing with Dropdown */}
            <div className="form-group">
              <label>Book Tags (Max 3)</label>
              <div className="tags-container">
                {tags.map((tag) => (
                  <div key={tag} className="tag">
                    {tag}
                    <FaTimes
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-icon"
                    />
                  </div>
                ))}
                {tags.length < 3 && (
                  <div className="add-tag-wrapper">
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="tag-dropdown"
                    >
                      <option value="">Select a tag</option>
                      {ALLOWED_TAGS.filter((tag) => !tags.includes(tag)).map(
                        (tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      onClick={() => handleAddTag(newTag)}
                      className="add-tag-btn"
                      disabled={!newTag}
                    >
                      <FaPlusCircle />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Book Cover Editing */}
            <div className="form-group">
              <label>Book Cover</label>
              <div className="book-cover-upload">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Book Cover"
                    className="preview-image"
                  />
                )}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="image-input"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current.click()}
                  className="upload-cover-btn"
                >
                  <BiImageAdd /> Change Cover
                </button>
              </div>
            </div>
            <div className="form-group">
          <label>Content Titles</label>
          <div className="content-titles-container">
            {contentTitles.map(title => (
              <div key={title} className="content-title">
                {title}
                <FaTimes 
                  onClick={() => handleRemoveContentTitle(title)} 
                  className="content-titles-remove-title-icon" 
                />
              </div>
            ))}
            <div className="content-titles-add-content-title-wrapper">
              <input
                type="text"
                value={newContentTitle}
                onChange={(e) => setNewContentTitle(e.target.value)}
                placeholder="Enter content title"
                className="content-titles-content-title-input"
              />
              <button 
                onClick={handleAddContentTitle} 
                className="content-titles-add-content-title-btn"
                disabled={!newContentTitle.trim()}
              >
                <FaPlusCircle /> Add
              </button>
            </div>
          </div>
        </div>
          </div>
        )}
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = chapters.map((chapter) => chapter.content);
    if (!image) {
      return setError("Image is required.");
    }
    
    if (!summary) {
      return setError("Summary is required.");
    }
    
    if (tags.length < 1) {
      return setError("At least one tag is required.");
    }
    
    if (content.some(el => el.length < 1500)) {
      return setError("Each content element must have at least 1500 characters.");
    }
    setIsUploading(true);
    setUploadProgress(0);

    try {
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("contentTitles", JSON.stringify(contentTitles));
      formData.append("summary", summary);
      formData.append("tags", JSON.stringify(tags));
      formData.append("image", image);

      formData.append("content", JSON.stringify(content));

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 200);
      // console.log("title", title, "contentTitles", contentTitles, "summary", summary, "tags", tags, "content", content, 'image: ', image )
      await instance.post(`/story/addstory`, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Clear localStorage after successful submission
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      navigate("/editstory");
    } catch (err) {
      setError(err?.response?.data?.errorMessage || "Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="enhanced-book-editor">
      <form onSubmit={handleSubmit} className="editor-form">
        {renderMetadataSection()}

        {/* Chapter Editors */}
        <div className="chapter-editors">{renderChapterEditors()}</div>

        {/* Add Chapter Button for Full and Add Modes */}
        <div className="add-chapter-wrapper">
          <button
            type="button"
            onClick={handleAddChapter}
            className="add-chapter-btn"
          >
            <span className="add-chapter-icon">+</span>
            Add New Chapter
          </button>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="upload-progress-editbook">
            <div
              className="progress-bar-editbook"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}

        {/* Error Display */}
        {error && <div className="error-message">{error}</div>}

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AddBookEditor;
