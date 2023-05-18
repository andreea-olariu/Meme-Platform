import React, {useCallback, useEffect, useState} from "react"
import styled, {css} from "styled-components"

import UpdateDescriptionModal from "./components/UpdateDescriptionModal"

import {auth, db} from "../../utils/firebase"
import UploadModal from "./components/UploadModal"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleXmark, faHourglassStart} from "@fortawesome/free-solid-svg-icons"
import {Button, Popover} from "antd";

const FlexDisplay = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

const Content = styled.div`
  max-width: 880px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  padding: 20px;
`

const Image = styled.img`
  height: 180px;
  width: 180px;
  border-radius: 50%;
`


const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  padding: 20px;
`

const Name = styled.div`
  font-size: 30px;
`

const Description = styled.div`
  font-size: 18px;
  margin: 10px 0px 30px 0px;
`

const ActionsWrap = styled.div`
  display: flex;

  & :not(:first-child) {
    margin-left: 8px;
  }
`

const Card = styled.div`
  background-image: url(${(props) => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  display: flex;
  justify-content: flex-end;

  width: 300px;
  height: 250px;
  border-radius: 10px;
  margin-right: 20px;

  :nth-child(3n + 3) {
    margin-right: 0;
  }
`

const StyledButton = styled(Button)`
  background: none;
  border: none;
  color: grey;
  box-shadow: none;
`


export default function Profile() {
    const [userDetails, setUserDetails] = useState({})
    const [userMemes, setUserMemes] = useState([])
    const [lovedMemes, setLovedMemes] = useState([])

    // get user details
    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {
            const currentUser = snapshot.docs.find((doc) => doc.data()?.userId === auth?.currentUser?.uid)
            setUserDetails({
                description: currentUser.data().description,
                avatarUrl: currentUser.data().avatarUrl,
                username: currentUser.data().username,
                documentId: currentUser.id,
                story: ""
            })
        })
    }, [])

    // get user memes
    useEffect(() => {
        db.collection("memes").onSnapshot((snapshot) => {
            const filteredMemes = snapshot.docs.filter((doc) => doc.data().userId === auth.currentUser?.uid)
            setUserMemes(filteredMemes.map((meme) => ({id: meme.id, ...meme.data()})))
        })
    }, [])


    // delete meme
    const deleteMeme = useCallback((id) => {
        const deleteMemeFromDB = async () => {
            db.collection("memes")
                .doc(id)
                .delete()
                .then(() => {
                    console.log("i've deleted the meme... ")
                }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
        deleteMemeFromDB()
    })

    // get loved memes
    useEffect(() => {
        db.collection("memes").onSnapshot((snapshot) => {
            const filteredMemes = snapshot.docs.filter((doc) => doc.data().lovedBy?.includes(auth.currentUser?.uid))
            setLovedMemes(filteredMemes.map((meme) => ({id: meme.id, ...meme.data()})))
        })
    }, [])

    const setStory = (url) => {

        // get the date when story was set
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;

        const updateUser = async () => {
            db.collection("users")
                .doc(userDetails.documentId)
                .update({
                    story: url,
                    storyAdded: dateTime
                })
                .then(res => console.log("Story updated"))
        }

        updateUser()

    }


    const renderMeme = (meme) => {
        {/* set the meme image as background for div */
        }
        return (<Card key={meme.id} src={meme.imageUrl} alt={meme.imageUrl}>
            {/* button for setting the meme as story */}
            <Popover title="Set as story" trigger="hover" overlayStyle={{textAlign: "center"}}>
                <StyledButton onClick={() => setStory(meme.imageUrl)}>
                    <FontAwesomeIcon icon={faHourglassStart}/>
                </StyledButton>
            </Popover>
            {/* button for deleting the meme */}
            <Popover title="Delete" trigger="hover" overlayStyle={{textAlign: "center"}}>
                <StyledButton onClick={() => deleteMeme(meme.id)}>
                    <FontAwesomeIcon icon={faCircleXmark}/>
                </StyledButton>
            </Popover>
        </Card>)
    }


    return (<Content>
        <UserDetails>
            <Image src={userDetails?.avatarUrl} alt={userDetails?.username}/>
            <Name>{userDetails?.username || "-"}</Name>
            <Description>{userDetails?.description || "-"}</Description>
            <ActionsWrap>
                <UploadModal
                    buttonText="Upload Avatar"
                    database="users"
                    reff="avatars"
                />
                <UpdateDescriptionModal
                    documentId={userDetails?.documentId}
                    currentDescription={userDetails?.description}
                />
                <UploadModal buttonText="Upload Meme" database="memes" reff="memes"/>
            </ActionsWrap>
        </UserDetails>
        {/* show posted memes & loved memes */}
        {userMemes.length === 0 ? (<span>You do not have uploaded memes yet</span>) : (<FlexDisplay>
            <span>Your memes: </span>
            <CardsWrapper>
                {userMemes.map(renderMeme)}
            </CardsWrapper>
        </FlexDisplay>)}
        {lovedMemes.length === 0 ? (<span>You have not loved any memes yet:(</span>) : (<FlexDisplay>
            <span>Memes you have loved:</span>
            <CardsWrapper>
                {lovedMemes.map((meme) => <Card key={meme.id} src={meme.imageUrl} alt={meme.imageUrl}/>)}
            </CardsWrapper>
        </FlexDisplay>)}
    </Content>)
}
