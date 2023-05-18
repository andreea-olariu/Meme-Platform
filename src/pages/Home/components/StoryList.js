import React, {useContext} from "react"
import uuid from "react-uuid"
import styled from "styled-components"
import Story from "./Story";
import {HomeContext} from "../../../services/homeContext";

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 80px;
  align-items: center;
  justify-content: space-around;
`

export default function StoryList() {
    const {stories} = useContext(HomeContext)
    return (
        <Wrap>
        {stories.length === 0 ? (<div></div>) :
                (stories.map(story => <Story key={uuid()} story={story.story} avatarUrl={story.avatarUrl} username={story.username} storyAdded={story.storyAdded}>story</Story>))}
        </Wrap>
    )
}