import React from "react"
import styled, {css} from "styled-components";
import {useNavigate} from "react-router-dom";


const Title = styled.div`
  margin: 0px;
  font-size: 16px;
  font-weight: bold;
`

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 30px;
`

const FlexDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  width: 100%;

  ${(props) =>
      props.click &&
      css`
        &:hover {
          background-color: #f3f3f3;
          cursor: pointer;
        }
  `}
`


export default function User({user, click}) {
    const navigate = useNavigate()

    /* navigate to that user profile page */
    const showProfile = (username) => {
        navigate(`/stalk/${username}`)
    }
    return(
        <FlexDisplay click={click} onClick = {click ? (() => showProfile(user.username)) : null}>
            <Image src={user.avatarUrl} alt="Avatar"/>
            <Title>{`@${user.username}`} </Title>
        </FlexDisplay>
    )
}