import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import {
    MdOutlineWavingHand,
    MdWavingHand
} from 'react-icons/md'
import { BsThreeDots } from 'react-icons/bs'
import { BsReply } from 'react-icons/bs'
import instance from '../../Context/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa'


const CommentItem = ({ comment, activeUser, isComment, style, RepliesEvent, commentReplyEvent }) => {
    const navigate = useNavigate()
    const [likeCount, setLikeCount] = useState(comment.likeCount)
    const [likeStatus, setLikeStatus] = useState(false)

    const commentRepliesLength = comment.replies.length
    useEffect(() => {

        const getCommentLikeStatus = async () => {

            const comment_id = comment._id
            try {
                const { data } = await instance.post(`/comment/${comment_id}/getCommentLikeStatus`, { activeUser }, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })
                setLikeStatus(data.likeStatus)
            }
            catch (error) {

                localStorage.removeItem("authToken")
                navigate("/")
            }
        }

        getCommentLikeStatus()

    }, [activeUser, comment._id, navigate])
    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
        return datestring
    }


    const handleCommentLike = async () => {

        const comment_id = comment._id

        try {
            const { data } = await instance.post(`/comment/${comment_id}/like`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })

            setLikeCount(data?.data?.likeCount)
            setLikeStatus(data?.likeStatus)

        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }


    const handleReply = () => {
        if(isComment){
            localStorage.setItem('parentComment',  JSON.stringify(comment))
            window.dispatchEvent(commentReplyEvent)
        }else{
            localStorage.setItem('taggedUsername', comment?.author?.username)
            window.dispatchEvent(commentReplyEvent)
        }
        
        // Clean up the event listener when the component unmounts
        return () => {
            localStorage.removeItem('taggedUsername')
            localStorage.removeItem('replies')
            window.dispatchEvent(RepliesEvent)
          };
    }
    
    const checkReply = () => {
        localStorage.setItem('replies', JSON.stringify(comment))  
        window.dispatchEvent(RepliesEvent)
    }

    
    
    return (

        <div className='comment-item' style={style}>
            <div className="comment-top-block">

                <section>
                    <img src={comment.author.photo} alt={comment.author.username} width="35" />

                    <div>
                        <span className='comment-author-username' >{comment.author.username}</span>
                        <span className='comment-createdAt'>{editDate(comment.createdAt)}</span>
                    </div>
                </section>

                <section>
                    <BsThreeDots />
                </section>
            </div>


            <div className="comment-content">

                <span dangerouslySetInnerHTML={{ __html: comment.content }}></span>

            </div>


            <div className="comment-bottom-block">

                <div className="commentLike-wrapper">


                    <i className='biLike' onClick={() => handleCommentLike()}>
                        {
                            likeStatus ? <MdWavingHand /> : <MdOutlineWavingHand />

                        }
                    </i>
                    <span className='commentlikeCount'>
                        {likeCount}

                    </span>
                    {isComment? <>
                    <i className='biLike' onClick={checkReply} style={{paddingLeft: '7px'}}>
                        <FaRegComment />
                    </i>
                    <span className='commentlikeCount'>
                        {commentRepliesLength}
                    </span>
                    </> : ''
                    }
                    <i className='biLike' onClick={handleReply} style={{paddingLeft: '7px'}}>
                        <BsReply />
                    </i>
                </div>


                <div className="comment-star">
                    {
                        [...Array(5)].map((_, index) => {
                            return (
                                <FaStar
                                    key={index}
                                    className="star"
                                    size={15}
                                    color={comment.star > index ? "#0205b1" : "grey"}
                                />
                            )
                        })
                    }

                </div>

            </div>

        </div>

    )
}

export default CommentItem;
