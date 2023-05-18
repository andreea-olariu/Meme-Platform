import React, {useState} from "react";
import styled from "styled-components";
import {Modal} from "antd";
import User from "./User";

const Card = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 2px;
  border: 2px solid forestgreen;
  display: flex;
  justify-content: center;
  cursor: pointer;

  img {
    width: 90%;
    border-radius: 50%;
  }
`


const StyledModal = styled(Modal)`
  .meme-img {
    width: 100%;
  }

`

export default function Story({story, username, avatarUrl, storyAdded}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seen, setSeen] = useState(false)

    /* if the story is seen, change the border color to black */
    const showModal = (url) => {
        setIsModalOpen(true);
        setSeen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{margin: "0px 10px"}}>
            <Card onClick={() => showModal(story)} style={seen? {border: "2px solid black"} : {} }>
                <img className="meme-img" src={story} alt="Meme"/>
            </Card>
            <StyledModal title="Story" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <User user={{avatarUrl, username}}/>
                <img className="meme-img" src={story} alt="Meme"/>
            </StyledModal>
        </div>
    )
}