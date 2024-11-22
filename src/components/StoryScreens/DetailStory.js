import instance from '../../Context/axiosConfig';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css"
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';
import configData from '../../config.json'
import 'react-quill/dist/quill.snow.css';
import Replies from '../CommentScreens/replies';




const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  // const [storyLikeUser, setStoryLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const navigate = useNavigate()
  const [isReply, setIsReply] = useState(false)
  const [comment, setcomment] = useState({})
  const [parentComment, setParentComment] = useState({})
  const [taggedUsername, setTaggedUsername] = useState('')
  const commentReplyEvent = useMemo(() => new Event('commentReplyEvent'), []);
  const RepliesEvent = useMemo(() => new Event('repliesEvent'), []);
  const handleCheckReply = useCallback(() => {
    // Update state or take other actions when local storage changes
      const reply = JSON.parse(localStorage.getItem('replies'))
      setcomment(reply)
      reply? setIsReply(true) : setIsReply(false)
    },[])
  const handleCheckComment = useCallback(() => {
    // Update state or take other actions when local storage changes
    const comment = JSON.parse(localStorage.getItem('parentComment'))
    const taggedUsername = localStorage.getItem('taggedUsername')
    setParentComment(comment)
    setTaggedUsername(taggedUsername)
    },[])
  
    useEffect(() => {
    // Listen for the custom event
    window.addEventListener('repliesEvent', handleCheckReply);
    window.addEventListener('commentReplyEvent', handleCheckComment);
    
    // Clean up the event listener when the component unmounts
    return () => {
      localStorage.removeItem('parentComment')
      localStorage.removeItem('replies')
      localStorage.removeItem('taggedUsername')
      window.removeEventListener('repliesEvent', handleCheckReply);
      window.removeEventListener('commentReplyEvent', handleCheckComment);
    };
  }, [handleCheckReply, handleCheckComment]);
  

  useEffect(() => {

    const getDetailStory = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await instance.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await instance.post(`/story/${slug}`, { activeUser })
        setStory(data?.data)

        setLikeStatus(data?.likeStatus)
        setLikeCount(data?.data?.likeCount)
        // setStoryLikeUser(data.data.likes)
        setLoading(false)

        const story_id = data?.data?._id;

        if (activeUser?.readList) {

          if (!activeUser?.readList.includes(story_id)) {
            setStoryReadListStatus(false)
          }
          else {
            setStoryReadListStatus(true)

          }

        }

      }
      catch (error) {
        setStory({})
        navigate("/not-found")
      }

    }
    getDetailStory();

  }, [slug, setLoading, navigate])



  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus)
    }, 1500)

    try {
      const { data } = await instance.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setLikeCount(data?.data?.likeCount)
      // setStoryLikeUser(data?.data?.likes)

    }
    catch (error) {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await instance.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addStoryToReadList = async () => {

    try {

      const { data } = await instance.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setStoryReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }


  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1500);
  };

  // Function to process code blocks and add copy button
  function processCodeBlocks(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Find all elements with class 'ql-syntax'
    const codeBlocks = doc.querySelectorAll('.ql-syntax');
    
    // Add copy button to each code block
    codeBlocks.forEach((codeBlock) => {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-button';

      copyButton.innerHTML = copySuccess? '✓' : '🗒'
      

      codeBlock.appendChild(copyButton);
    });

    return doc.documentElement.innerHTML;
  }


  const copyButtons = document.querySelectorAll('.copy-code-button')
  const codeBlocks = document.querySelectorAll('.ql-syntax')
  codeBlocks?.forEach((codeBlock, index) => {
    copyButtons[index]?.addEventListener('click', () => {
        handleCopyCode(codeBlock.innerText);
    })
  })
 window.scrollTo(0, 0)

    return (
    <>
    <Helmet>
        <title>{story?.title || `Blog || ${configData.Name}`}</title>
        <meta name="description" content={`${story?.content?.split(' ')?.slice(0, 150)?.join(' ')} readmore...`} />
      </Helmet>
     
      {
        loading ? <Loader /> :
          <>

            <div className='Inclusive-detailStory-page'>

              <div className="top_detail_wrapper">
                <Link to={'/'} >
                  <FiArrowLeft />
                </Link>
                <h5 style={{color: '#fff'}}>{story.title}</h5>

                <div className='story-general-info'>

                  <ul>
                    {story.author &&
                      <li className='story-author-info'>
                        <img src={story.author.photo} alt={story.author.username} />
                        <span className='story-author-username'>{story.author.username}  </span>
                      </li>
                    }
                    <li className='story-createdAt'>
                      {
                        editDate(story.createdAt)
                      }
                    </li>
                    <b>-</b>

                    <li className='story-readtime'>
                      {story.readtime} min read

                    </li>

                  </ul>

                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>

                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>


                      <b className='commentCount'>{story.commentCount}</b>

                    </div>
                  }

                  {activeUser && story.author &&
                    story.author._id === activeUser._id ?
                    <div className="top_story_transactions">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <FiEdit />
                      </Link>
                      <span className='deleteStoryLink' onClick={handleDelete}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>

              </div>

              <div className="CommentFieldEmp">

               { isReply ? <Replies 
                  slug={slug} 
                  sidebarShowStatus={sidebarShowStatus} 
                  setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser} 
                  comment={comment} 
                  commentReplyEvent={commentReplyEvent}
                  RepliesEvent={RepliesEvent}
                  taggedUsername={taggedUsername}
                  /> 
                  :
                <CommentSidebar 
                  slug={slug} 
                  sidebarShowStatus={sidebarShowStatus} 
                  setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser}
                  commentReplyEvent={commentReplyEvent}
                  RepliesEvent={RepliesEvent}
                  comment={parentComment}
                />}

              </div>

              <div className='story-content' >

                <div className="story-banner-img">
                  <img src={story.image} alt={story.title} className='story-banner-image'/>

                </div>

                <div className='content' style={{color: '#fff'}} dangerouslySetInnerHTML={{ __html: processCodeBlocks(story.content) }}>
                </div>

              </div>

              {activeUser.username &&
                <div className='fixed-story-options'>

                  <ul>
                    <li>

                      <i onClick={handleLike} >

                        {likeStatus ? <FaHeart color="#0063a5" /> :
                          <FaRegHeart />
                        }
                      </i>

                      <b className='likecount'
                        style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}
                      >  {likeCount}
                      </b>

                    </li>


                    <li>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>

                      <b className='commentCount'>{story.commentCount}</b>

                    </li>

                  </ul>

                  <ul>
                    <li>
                      <i onClick={addStoryToReadList}>

                        {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> :
                          <BsBookmarkPlus />
                        }
                      </i>
                    </li>

                    <li className='BsThreeDots_opt'>
                      <i  >
                        <BsThreeDots />
                      </i>

                      {activeUser &&
                        story.author._id === activeUser._id ?
                        <div className="delete_or_edit_story  ">
                          <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                            <p>Edit Story</p>
                          </Link>
                          <div className='deleteStoryLink' onClick={handleDelete}>
                            <p>Delete Story</p>
                          </div>
                        </div> : null
                      }

                    </li>

                  </ul>

                </div>
              }

            </div>
          </>
      }
    </>
  )
}

export default DetailStory;
