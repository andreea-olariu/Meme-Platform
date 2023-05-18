import {Button, Input, Modal} from "antd"
import React, {useState, useEffect, useContext} from "react"
import {db, auth} from "../../../utils/firebase"
import {HomeContext} from "../../../services/homeContext";
import uuid from "react-uuid";


/* Component that shows the modal where users can see comments & can comment after they click on comment icon */
export default function CommentModal({isModalOpen, setIsModalOpen, meme, docId, comments, setComments}) {
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        setNewComment(newComment)
    }, [newComment])

    /* when user presses ok, the comment should be saved in DB */
    const handleOk = () => {
        setIsModalOpen(false)
        const comments = meme.comments ? meme.comments : []
        db.collection("memes")
            .doc(docId)
            .update({
                comments: [...comments, {comment: newComment, user: auth.currentUser.displayName}]
            }).then(r => console.log("Updated comments!"))

        setComments((current) => [...current, newComment])
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (<>
        <Modal
            title="Comments"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <>
                {comments.map(comment => <div key={uuid()}>{`@${comment.user} commented ${comment.comment}`}</div>
                )}
            </>
            <Input
                label="Comment"
                placeholder="Comment"
                onChange={(event) => setNewComment(event.target.value)}
                value={newComment}
            />
        </Modal>
    </>)
}
