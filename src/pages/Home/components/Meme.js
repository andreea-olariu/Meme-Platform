import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {faComment, faHeart, faBookmark} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {auth, db} from "../../../utils/firebase";
import CommentModal from "./CommentModal";
import HomeContextProvider, {HomeContext} from "../../../services/homeContext";
import User from "./User";
import "react-toastify/dist/ReactToastify.css"
import {Image} from "antd";

const Card = styled.div`
  min-width: 200px;
  margin: 5px auto;
  border:1px solid lightgrey;
  padding: 20px;
  background: white;

  .meme-img {
    width: 350px;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

`
const Bar = styled.div`
  display: flex;
  justify-content: space-around;
  color: darkgrey;
  margin: 20px 0px;

  svg {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  #heart:hover {
    color: red;
  }

  #comm:hover {
    color: blue;
  }

  #save:hover {
    color: purple;
  }
`
/* when user click save meme, that meme should be saved in DB as the meme of the user who clicked */
const saveMeme = (url) => {
    db.collection("memes").add({
        imageUrl: url, username: auth.currentUser.displayName, userId: auth.currentUser.uid,
    }).then(r => console.log("Meme saved!"))
}



export default function Meme({meme, docId, showUser}) {
    const {showToastLovedMeme, showToastSavedMeme} = useContext(HomeContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [comments, setComments] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    /* when user click love meme, that meme should be updated. add the user who clicked in the array lovedBy */
    const addLovedBy = (docId, meme) => {
        const lovedBy = meme.lovedBy ? meme.lovedBy : []
        if (lovedBy.includes(docId)) {
            return;
        } else {
            db.collection("memes")
                .doc(docId)
                .update({
                    lovedBy: [...lovedBy, auth.currentUser.uid]
                }).then(r => console.log("Updated loved by!"))
        }
    }

    /* get the user and the comments */
    useEffect(() => {
        db.collection("memes").onSnapshot(snapshot => {
            const foundDoc = snapshot.docs.find(doc => doc.id === docId)
            const foundComments = foundDoc.data().comments ? foundDoc.data().comments : []
            setComments(foundComments)
        })
        db.collection("users").onSnapshot(snapshot => {
            const user = snapshot.docs.find(doc => doc.data().userId === meme.userId)
            setCurrentUser(user.data())
        })
    }, [])

    return (<HomeContextProvider>
        <Card>
            {/* conditional rendering -> only for specific pages the user who posted the meme should be shown */}
            {showUser ? (<User user={currentUser} onClick={true}/>) : ("")}

            <Image className="meme-img"  key={meme.imageUrl} src={meme.imageUrl} />
            {/* conditional rendering -> only for specific pages the bar of utilities - love, comment, save - should be shown */}
            {showUser ? (<Bar>
                <FontAwesomeIcon id="heart" icon={faHeart} onClick={() => {
                    addLovedBy(docId, meme)
                    showToastLovedMeme()
                }}/>
                <FontAwesomeIcon id="comm" icon={faComment} onClick={() => setIsModalOpen(true)}/>
                <FontAwesomeIcon id="save" icon={faBookmark} onClick={() => {
                    saveMeme(meme.imageUrl)
                    showToastSavedMeme()
                }}/>
                <CommentModal meme={meme} docId={docId} comments={comments} setComments={setComments}
                              isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            </Bar>) : ("")}
        </Card>
    </HomeContextProvider>)
}


export {saveMeme}