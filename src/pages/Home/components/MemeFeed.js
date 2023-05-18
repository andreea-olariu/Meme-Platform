import React, {useContext} from "react";
import Meme from "./Meme";
import uuid from "react-uuid"
import styled from "styled-components";
import HomeContextProvider, {HomeContext} from "../../../services/homeContext";

const FlexDisplay = styled.div`
  display: flex;
  flex-direction: column;
`

export default function MemeFeed() {
    const {memes} = useContext(HomeContext)
    return (// eslint-disable-next-line react/react-in-jsx-scope
        <HomeContextProvider>
            <FlexDisplay>
                {memes.map((meme) => <Meme key={uuid()} {...meme} showUser={true}></Meme>)}
            </FlexDisplay>
        </HomeContextProvider>)
}