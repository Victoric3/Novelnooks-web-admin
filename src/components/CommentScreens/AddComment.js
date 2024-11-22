import React, { useState, useRef, useEffect } from 'react'
import instance from '../../Context/axiosConfig';
import StarRating from './StarRating';
import { BsShieldCheck, BsCheckAll } from 'react-icons/bs'
import { IoAdd } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import '../../Css/AddComment.css'
import Loader from "../GeneralScreens/Loader";
import { FaTimes } from 'react-icons/fa';



const AddComment = ({ 
    setSidebarShowStatus, 
    slug, 
    getStoryComments, 
    activeUser, 
    count, 
    reply, 
    style, 
    comment,
    commentReplyEvent,
    taggedUsername
}) => {

    const navigate = useNavigate();
    const textareaRef = useRef(null)
    const [star, setStar] = useState(0);
    const [starCurrentVal, setStarCurrentVal] = useState(0);
    const [content, setContent] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [showStatus, setShowStatus] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [parentCommenter, setParrentCommenter] = useState('')

    const handleRemoveReplyTag = () => {
        localStorage.removeItem('parentComment')
        localStorage.removeItem('taggedUsername')
        window.dispatchEvent(commentReplyEvent)
    }
    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        const parentCommentId = comment?._id
        const contentForUpload = taggedUsername? `<div><p style="color: blue;">@${taggedUsername}</p><div>${content}</div></div>` : content;

        try {
            await instance.post(`/comment/${slug}/addComment`, { content: contentForUpload, star, parentCommentId}, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })

            setSuccess('Add Comment successfully ')
            setIsLoading(false)
            setTimeout(() => {
                setSuccess('')
            }, 2700)

            setTimeout(() => {
                const commentCountInput = document.querySelector(".commentCount");

                if (commentCountInput) {
                const currentValue = parseInt(commentCountInput.textContent, 10);
                const newValue = currentValue + 1;

                // Update the value attribute of the input field
                commentCountInput.textContent = newValue.toString();
                }

            }, 650);
            handleRemoveReplyTag()

            clearInputs()
            await getStoryComments()

            
        }
        catch (error) {
            setIsLoading(false)
            if (error?.response?.data?.error === 'Jwt expired') {
                console.log("token expired ...")
                navigate('/')
            }
            setError(error?.response?.data?.error)
            setTimeout(() => {
                setError('')
            }, 4500)
        }
    }

    const clearInputs = () => {
        setStar(0)
        setStarCurrentVal(0)
        setContent('')
        textareaRef.current.textContent = ''

    }

    useEffect(() => {
        if(comment?.author?.username === activeUser.username){
            setParrentCommenter('yourSelf')
            }else{
                setParrentCommenter(comment?.author?.username)
            }
    }, [parentCommenter, comment, activeUser])
    
      


      return (

        <div className="addComment-card" style={style}>
            <div className="sidebar-top-block">

                <h3>Responses ( <span className='sidebar-commentCount'>{count}
                </span> )   </h3>

                <div>

                    < BsShieldCheck />
                    <IoAdd onClick={() => setSidebarShowStatus(false)} className='ıoAddIcon' />
                </div>
            </div>

            {error && <div className="alert-error-message">{error}</div>}


            {activeUser.username &&

                <form className='addComment-form' onSubmit={handleSubmit}>


                    {success && <div className="alert-success-message">
                        <BsCheckAll />
                        {success}</div>}


                    <div className={showStatus ? 'activeuser-info ' : 'activeuser-info hidden '}>
                        <img src={activeUser.photo} alt={activeUser.username} />
                        <span className='username'>{activeUser.username}  </span>
                        {comment?._id && !reply? <span style={{padding: '5px'}}>•Replying to• {parentCommenter?.slice(0, 16) || taggedUsername}</span>:''}
                    </div>

                    <div className="textarea-wrapper">
                        {reply && taggedUsername ? 
                        <div style={{display: 'flex', alignItems: 'center'}}>
                        <p style={{color: 'blue'}}>@{taggedUsername}</p> 
                        <FaTimes onClick={handleRemoveReplyTag} className='remove-tag' />
                        </div>
                        : 
                        ''}
                        <div ref={textareaRef}
                            contentEditable
                            placeholder= {!taggedUsername ? 'What are your thoughts ?' : ''}
                            id="comment"
                            name="content"
                            onKeyUp={(e) => {
                                setContent(e.target.textContent)
                            }
                            }

                            onFocus={() => setShowStatus(true)}
                        >
                        </div>
                    </div>

                    <div className={showStatus ? 'form-bottom-block' : 'form-bottom-block hidden'} >
                        <StarRating setStar={setStar} setStarCurrentVal={setStarCurrentVal} starCurrentVal={starCurrentVal} />

                        <div className="formBtn-wrapper">
                            <button type='button'
                                className='cancel-Btn'
                                onClick={() => setShowStatus(!showStatus)}
                            >Cancel </button>
                            <button type='submit' className={content === '' || isLoading ? 'respond-Btn disable' : 'respond-Btn'}
                                disabled={content === '' || isLoading ? true : false}
                            >Respond </button>

                        </div>
                    </div>
                    {isLoading? <Loader /> : ''}

                </form>


            }
        </div>

    )
}

export default AddComment