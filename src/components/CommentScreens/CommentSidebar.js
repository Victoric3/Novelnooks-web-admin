import React, { useState, useEffect, useRef, useCallback } from 'react';
import StoryComments from './StoryComments';
import instance from '../../Context/axiosConfig';
import AddComment from './AddComment';

const CommentSidebar = ({ 
  slug, 
  sidebarShowStatus, 
  setSidebarShowStatus, 
  activeUser,
  commentReplyEvent,
  RepliesEvent,
  comment,
}) => {

  const [count, setCount] = useState(0)
  const [commentList, setCommentList] = useState([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollThreshold = 100; // The distance from the bottom of the page to trigger loading more comments
  const [error, setError] = useState(0)
  
  const sidebarRef = useRef(null);
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
  
  const getStoryComments = useCallback(async (pageNumber) => {
    try {

      setLoading(true);
      const response = await instance.get(`/comment/${slug}/getAllComment?page=${pageNumber}`);

      const newComments = response.data?.data

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
      setCount(response.data?.count);
      setPage(pageNumber);
      
    } catch (error) {

      if(error?.response?.status === 404){
        console.log(error?.response?.data?.errorMessage);
        setError(404)
      }else{
        console.log(error?.response?.data?.errorMessage);
      }
    } finally {
      setLoading(false);
    }

  },[slug, commentList])

   const handleScroll = useCallback(() => {
    const sidebarElement = sidebarRef.current;
    const scrollHeight = sidebarElement.scrollHeight;
    const scrollTop = sidebarElement.scrollTop;
    const clientHeight = sidebarElement.clientHeight;
    
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold && !loading) {
      // Load more comments when the user is close to the bottom
      getStoryComments(page + 1);
    }

  },[ loading, page, getStoryComments])
  
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
 }, [page, handleScroll, error]);

  useEffect(() => {
    getStoryComments(page)
    
    //eslint-disable-next-line
  }, [])
  

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

  

  return (

    <div ref={sidebarRef} className={sidebarShowStatus ? "Inclusive-comment-sidebar visible" : "Inclusive-comment-sidebar hidden "}  >

      <div className='sidebar-wrapper'>

        <AddComment 
        setSidebarShowStatus={setSidebarShowStatus} 
        slug={slug} 
        getStoryComments={getStoryComments} 
        activeUser={activeUser} 
        count={count} 
        commentList={commentList}
        style={{marginTop: count > 0? '-290px' : '0px'}}
        commentReplyEvent={commentReplyEvent}
        RepliesEvent={RepliesEvent}
        comment={comment}
        />

        <StoryComments 
          commentlist={commentList} 
          activeUser={activeUser} 
          count={count} 
          slug={slug} 
          isStory={true}
          style={{marginTop: '290px'}}
          commentReplyEvent={commentReplyEvent}
          RepliesEvent={RepliesEvent}
        />
        
        {loading? <p style={{color: 'blue'}}>Loading...</p> : ''}
      </div>

    </div>

  )
}

export default CommentSidebar;
