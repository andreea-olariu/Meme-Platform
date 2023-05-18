import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Image, Input} from "antd";
import {faBookmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {saveMeme} from "../../Home/components/Meme";
import styled from "styled-components";
import {toast, ToastContainer} from "react-toastify";

const StyledInput=styled(Input)`
  width: 70%;
  margin: 10px 0px;
`

const FlexDisplay=styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  svg {
    cursor: pointer;
  }
`

export default function MemeGenerator() {
    const {id} = useParams()
    const [topText, setTopText] = useState("top text")
    const [bottomText, setBottomText] = useState("bottom text")
    const [meme, setMeme] = useState("")

    useEffect(() => {
        const postUrl = `https://api.imgflip.com/caption_image`
        const details = {
            "template_id": `${id}`,
            "username": "AndreeaOlariu",
            "password": "fiipractic",
            "text0": `${topText}`,
            "text1": `${bottomText}`
        }
        let formBody = [];

        for (const property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(postUrl, {
            method: "POST", body: formBody, headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
        })
            .then(res => res.json())
            .then(data => setMeme(data.data.url))
            .catch(err => console.error('error:' + err));
    }, [topText, bottomText])

    const showToastSavedMeme = () => {
        console.log("ok")
        toast.success('You have saved this meme!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    return (<FlexDisplay>
        <ToastContainer/>
        <StyledInput placeholder="Top Text" onChange={(e) => setTopText(e.target.value)}/>
        <StyledInput placeholder="Bottom Text" onChange={(e) => setBottomText(e.target.value)}/>
        <img src={meme} style={{width: "250px"}} alt={"Meme"}/>
        <FontAwesomeIcon id="save" style={{marginTop: "20px"}} icon={faBookmark} onClick={() => {
            showToastSavedMeme()
            saveMeme(meme)
        }}/>

    </FlexDisplay>)
}