import React from 'react';
import CommentItem from './CommentItem';
import '../../Css/StoryComments.css'

const StoryComments = ({ 
    commentlist, 
    count, 
    activeUser, 
    slug, 
    isStory, 
    style,
    commentReplyEvent,
    RepliesEvent
}) => {
   
    
    
    return (
        <>
            {count !== 0 ?
                <div className= 'storyComments' style={style}>
                    <h5>MOST RELEVANT</h5>
                    <div className="comment-Wrapper">
                        {
                            commentlist?.map((comment) => {
                                return (
                                    <CommentItem 
                                    key={comment._id} 
                                    comment={comment} 
                                    activeUser={activeUser} 
                                    slug={slug} 
                                    isComment={isStory}
                                    RepliesEvent= {RepliesEvent}
                                    commentReplyEvent={commentReplyEvent}
                                    />
                                )
                            })
                        }
                    </div>

                </div> :
                <div className='no-response'>There are currently no responses for this story.
                    Be the first to respond. </div>
            }
        </>
    )
}

export default StoryComments;
