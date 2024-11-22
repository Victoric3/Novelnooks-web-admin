import React, { useState, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import instance from '../../Context/axiosConfig';
import { AuthContext } from '../../Context/AuthContext';
import '../../Css/AddStory.css';


const RichTextEditor = () => {
  const { config } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  let question;
  try {
    question = JSON.parse(localStorage.getItem('question'));
  } catch (error) {
    console.error(error);
  }

  const optionsWithLetters = question?.options?.map((option, index) => {
    const letter = String.fromCharCode('a'.charCodeAt(0) + index);
    return `${letter}. ${option}`;
  });

  const getLetterFromIndex = (index) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return letters[index] || ''; // Handle indices beyond 'z'
  };
  
  const [content, setContent] = useState(
    question
      ? `<div style={{display: 'flex', flexDirection: 'column'}}>
            <h3>Subject: <strong>${question?.course}</strong></h3>
            <h4>Topic: <strong>${question?.topic}</strong></h4>
            <h5>Question: ${question?.question}</h5>
            <p>${optionsWithLetters?.join('<br>')}</p>
            <p>kingsheart chose: <strong>option ${getLetterFromIndex(
              question?.correctOption
            ).toUpperCase()}</strong></p>
            <p>their explanation: <strong>${question?.explanation}</strong></p>
            <p>i think its wrong because(Please explain the reason behind your choice for this answer, and kindly refrain from using inappropriate language in your response)</p>
            <br>
            <p>post in the comments what you think of this question!</p>
        </div>`
      : ''
  );

  const handleChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = async (e) => {
    const input = e.target;
    setIsLoading(true)

    try {
        if (input.files && input.files[0]) {
            const imageData = new FormData();
            imageData.append('image', input.files[0]);

            // Send the imageUrl to your server for storage
            const response = await instance.post('/story/addImage', imageData, config);
            if (response.data.success) {
                setSuccess('image saved');
                setIsLoading(false)
                const imageUrl = response.data.url;
                // Update the content with the image tag and additional styling
                const updatedContent = `${content} <img src="${imageUrl}" alt="Uploaded Image"/>`;
                setContent(updatedContent);
                input.value = null;
                setTimeout(() => {
                  setSuccess(null)
                }, 4000)
              } else if (!response.data.success) {
                setIsLoading(false)
                input.value = null
                setSuccess(null)
                setError('this image was not saved');
                setTimeout(() => {
                  setError(null)
                }, 4000)
            }

        }
    } catch (e) {
      setIsLoading(false)
      input.value = null
      setSuccess(null)
      setError('something went wrong');
      setTimeout(() => {
        setError(null)
      }, 4000)
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
    localStorage.setItem('content', content);
  }, [content]);

  return (
    <div>
      <><input id="file-upload" type="file" onChange={handleImageUpload}/> {error || success? <span style={{color: success ? 'green' : 'red'}}>{error || success}</span> : ''}{isLoading ? <span style={{color: 'blue'}}>Uploading...</span>: ''}</>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="react-quill"
        placeholder="Start writing..."
        theme="snow"
        style={{color: '#ccc'}}
      />
    </div>
  );
};

export default RichTextEditor;
