import React, { useState, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import instance from '../../Context/axiosConfig';
import { AuthContext } from '../../Context/AuthContext';
import '../../Css/AddStory.css';


const RichTextEditor = ({ chapter }) => {
  const { config } = useContext(AuthContext);

  const [content, setContent] = useState(localStorage.getItem(`EditedContent-${chapter}`));

  const handleChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = async (e) => {
    const input = e.target;

    try {
        if (input.files && input.files[0]) {
            const imageData = new FormData();
            imageData.append('image', input.files[0]);

            // Send the imageUrl to your server for storage
            const response = await instance.post('/story/addImage', imageData, config);
            if (response.data.success) {
                console.log('image saved');
                const imageUrl = response.data.url;
                // Update the content with the image tag and additional styling
                const updatedContent = `${content} <img src="${imageUrl}" alt="Uploaded Image"/>`;
                setContent(updatedContent);
                console.log(updatedContent);
                input.value = null;

            } else if (!response.data.success) {
                console.log('this image was not saved');
            }

        }
    } catch (e) {
        console.log(e);
        // setError('something went wrong while uploading image')
    }
};


  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote', 'code-block'], // Add 'image' to include the default image button
        [{ 'color': [] }, { 'background': [] }], // Text color and background color
        [{ align: [] }, 'clean', { indent: '-1' }, { indent: '+1' }],

      ],
      
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'code-block',
    'color',
    'background',
    'clean',
    'blockquote',
    'indent',
    'align'
  ];

  const quillRef = React.useRef();

  useEffect(() => {
    localStorage.setItem('EditedContent', content);
  }, [content]);

  return (
    <div>
      <input id="file-upload" type="file" onChange={handleImageUpload}/>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="react-quill"
        placeholder="Start writing..."
        theme="snow"
        style={{color: "#ccc"}}
      />
    </div>
  );
};

export default RichTextEditor;
