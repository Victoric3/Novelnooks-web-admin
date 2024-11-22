import React, { useState, useEffect, useRef, useCallback } from 'react';
import StoryComments from './StoryComments';
import instance from '../../Context/axiosConfig';
import AddComment from './AddComment';
import { FaArrowLeft } from 'react-icons/fa';
import CommentItem from './CommentItem';


const Replies = ({ 
  slug, 
  sidebarShowStatus, 
  setSidebarShowStatus, 
  activeUser, 
  comment, 
  commentReplyEvent,
  RepliesEvent,
  taggedUsername
}) => {

  const [count, setCount] = useState(0)
  const [commentList, setCommentList] = useState([])
  const [parentCommentId, setParentCommentId] = useState('')
  const [page, setPage] = useState(1);
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const scrollThreshold = 100; 
  const [error, setError] = useState(0)

  function getUniqueComments(allComments) {
    const uniqueComments = allComments.reduce((acc, comment) => {
      // Check if a comment with the same _id already exists in the accumulator
      const existingComment = acc.find(existing => existing._id === comment._id);
  
      // If not found, add the comment to the accumulator
      if (!existingComment) {
        acc.push(comment);
      }
  
      return acc;
    }, []);
  
    return uniqueComments;
  }



  const getCommentReplies = useCallback(async (pageNumber) => {
    try {
      setLoading(true)
      const { data } = await instance.get(`/comment/${parentCommentId}/replies?page=${pageNumber}`)
      const newComments = data?.replies

      // Combine existing and new comments in a new Set to eliminate duplicates
      const allComments = [...commentList, ...newComments];
      const sortedComments = allComments.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        if (a.likeCount > b.likeCount) return -1;
        if (a.likeCount < b.likeCount) return 1;
        return 0;
      });
      // Convert Set back to an array of comment objects
      const uniqueComments = getUniqueComments(sortedComments)
      
      setCommentList(uniqueComments);
      setCount(data?.replies.length)
      setPage(pageNumber);
      setLoading(false)
    }
    catch (error) {
      if(error?.response?.status === 404){
        console.log(error?.response?.data?.errorMessage);
        setError(404)
      }else{
        console.log(error?.response?.data?.errorMessage);
      }
      setLoading(false)
    }
    
  },[parentCommentId, commentList])

  const handleScroll = useCallback(() => {
    const sidebarElement = sidebarRef.current;
    const scrollHeight = sidebarElement.scrollHeight;
    const scrollTop = sidebarElement.scrollTop;
    const clientHeight = sidebarElement.clientHeight;
    
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold && !loading) {
      // Load more comments when the user is close to the bottom
      getCommentReplies(page + 1);
    }
    //eslint-disable-next-line
  },[ loading, page, getCommentReplies])
  
  useEffect(() => {
    const sidebarElement = sidebarRef.current;

    sidebarElement.addEventListener('scroll', handleScroll);

    if(error === 404){
      sidebarElement.removeEventListener('scroll', handleScroll)
    }

    // Remove event listener on component unmount
    return () => {
      sidebarElement.removeEventListener('scroll', handleScroll);
    };

  }, [page, error, handleScroll]);

  useEffect(() => {
    if(parentCommentId){ 
        getCommentReplies(page)
      }
    //eslint-disable-next-line
  }, [parentCommentId])


  useEffect(() => {
    const checkIfClickedOutside = e => {

      if (sidebarShowStatus && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarShowStatus(false)
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [sidebarShowStatus, setSidebarShowStatus])


  const handleBack = () => {
    localStorage.removeItem('parentComment')
    window.dispatchEvent(commentReplyEvent)
    localStorage.removeItem('replies')
    window.dispatchEvent(RepliesEvent)
  }

  useEffect(() => {
    setParentCommentId(comment._id)
  }, [comment._id])

  return (

    <div ref={sidebarRef} className={sidebarShowStatus ? "Inclusive-comment-sidebar visible" : "Inclusive-comment-sidebar hidden "}  >

      <div className='sidebar-wrapper'>
        <FaArrowLeft onClick={handleBack} style={{paddingBottom: '5px', fontSize: '20px'}}/>
        <AddComment 
        setSidebarShowStatus={setSidebarShowStatus} 
        slug={slug} 
        getStoryComments={getCommentReplies} 
        activeUser={activeUser} 
        count={count} 
        reply={true} 
        commentList={commentList}
        style={{marginTop: '0px'}}
        comment={comment}
        commentReplyEvent={commentReplyEvent}
        RepliesEvent={RepliesEvent}
        taggedUsername={taggedUsername}
        />
        <CommentItem 
        key={comment._id} 
        comment={comment} 
        activeUser={activeUser} 
        slug={slug} 
        isComment={true}
        style={{marginTop: '290px'}}
        commentReplyEvent={commentReplyEvent}
        RepliesEvent={RepliesEvent}
        />
        <StoryComments 
        commentlist={commentList} 
        activeUser={activeUser} 
        count={count} 
        slug={slug} 
        isStory={false}
        style={{marginTop: '0px'}}
        commentReplyEvent={commentReplyEvent}
        RepliesEvent={RepliesEvent}
        />
        {loading? <p style={{color: 'blue'}}>Loading...</p> : ''}
        

      </div>

    </div>

  )
}

export default Replies;
