import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom";
import {db} from "../../../utils/firebase";
import styled from "styled-components";
import User from "./User";
import {Card} from "antd";
import Meta from "antd/es/card/Meta";
import Meme from "./Meme";
import uuid from "react-uuid";
import HomeContextProvider from "../../../services/homeContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faThumbtack} from "@fortawesome/free-solid-svg-icons";


const Title = styled.div`
  margin: 0px;
  font-size: 16px;
  font-weight: bold;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-shadow: 1px 1px #f5f5f5;
  padding: 20px;

  .icon {
    font-size: 20px;
  }

  #heart {
    color: red;
  }

  #save {
    color: dodgerblue;
  }
`

const MemeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`

export default function StalkCard() {
    const {username} = useParams();
    const [user, setUser] = useState({})
    const [memesCount, setMemeCount] = useState(0)
    const [lovedMemesCount, setLovedMemeCount] = useState(0)
    const [memes, setMemes] = useState([])
    const [lovedMemes, setLovedMemes] = useState([])

    /* get the user based on the username from the URL */
    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {
            const foundUser = snapshot.docs.find((doc) => doc.data().username === username)
            setUser(foundUser.data())
        })
    }, [])

    /* get user's loved memes and posted memes */
    useEffect(() => {
        db.collection("memes").onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
                if (doc.data().userId === user.userId) {
                    setMemeCount((current) => current + 1);
                    setMemes((current) => [...current, doc]);
                }

                doc.data().lovedBy?.forEach((lovedby) => {
                    if (lovedby === user.userId) {
                        setLovedMemeCount((current) => current + 1)
                        setLovedMemes((current) => [...current, doc]);
                    }
                })
            })
        })

    }, [user])


    return (<HomeContextProvider>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Card style={{width: '50%'}}>
                <Meta avatar={<User user={user} click={false}/>}/>
                <Title> {`${username} posted ${memesCount} memes!`}
                    <FontAwesomeIcon id="save" className="icon" style={{color: "dodgerblue"}} icon={faThumbtack}/>
                </Title>
                <Title>
                   {`${username} loved ${lovedMemesCount} memes!`}
                    <FontAwesomeIcon id="heart" className="icon" icon={faHeart} style={{color: "red"}}/>
                </Title>
            </Card>
            <Wrapper>
                <FontAwesomeIcon id="save" className="icon" icon={faThumbtack}/>
                <MemeWrapper>
                    {memes.map((meme) => <Meme key={uuid()} meme={meme.data()} docId={meme.id} showUser={false}></Meme>)}
                </MemeWrapper>
            </Wrapper>
            <Wrapper>
                <FontAwesomeIcon id="heart" className="icon" icon={faHeart}/>
                <MemeWrapper>
                    {lovedMemes.map((meme) => <Meme key={uuid()} meme={meme.data()} docId={meme.id} showUser={false}></Meme>)}
                </MemeWrapper>
            </Wrapper>
        </div>
    </HomeContextProvider>)
}