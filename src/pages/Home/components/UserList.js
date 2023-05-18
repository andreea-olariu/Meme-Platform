import React, {useContext} from "react"
import User from "./User";
import {HomeContext} from "../../../services/homeContext";
import styled from "styled-components";
import uuid from "react-uuid";

const Wrapper = styled.div`
`
export default function UsersList() {

    const {users} = useContext(HomeContext)

    return (
        <Wrapper>
            {users.map((user) =>
                <User key={uuid()} user={user} click={true}/>
            )}
        </Wrapper>)
}