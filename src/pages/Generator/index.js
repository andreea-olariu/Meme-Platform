import React, {useEffect, useState} from "react"
import {Image} from "antd";
import uuid from "react-uuid";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  justify-content: space-around;
`

export default function Generate() {

    const url = 'https://api.imgflip.com/get_memes';
    const [memes, setMemes] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(json => setMemes(json.data.memes))
            .catch(err => console.error('error:' + err));
    }, [])


    const generateMeme = (id) => {
        navigate(`/generate/${id}`)
    }
    return (
        <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
            <h2>
                Choose a template:
            </h2>
            <Wrapper>
                {memes.map((meme) => <Image width={100} onClick={() => generateMeme(meme.id)} key={uuid()}
                                            src={meme.url}/>)}
            </Wrapper>
        </div>)
}
