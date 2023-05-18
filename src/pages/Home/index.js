import React, {useEffect, useState} from "react"
import StoryList from "./components/StoryList";
import MemeFeed from "./components/MemeFeed";
import {Button, Layout} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import HomeContextProvider from "../../services/homeContext";
import UsersList from "./components/UserList";
import {ToastContainer} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

const headerStyle = {
    textAlign: 'center',
    color: '#000',
    height: 80,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#f8f8f8',
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: "60px",
    zIndex: "1"
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#000',
    backgroundColor: '#fff',
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(to left, #34e89e, #0f3443)",
    overflow : "auto",
    height: "7npm00px"
};

const siderStyle = {
    textAlign: 'center', color: '#111',
    backgroundColor: '#f8f8f8', display: "flex",
    position: "fixed", top:"120px",
    overflow : "auto",
    height: "700px"

};


function Home() {
    /* show the sidebar if the user clicks on '+' and hide sidebar if user clicks '-' */
    const [sider, setSider] = useState(false)

    return (
        <HomeContextProvider>
        <ToastContainer/>
        <Layout > {sider ? (<Sider style={siderStyle} width={300}>
            <UsersList/>
        </Sider>) : ("")}
            <Layout>
                <Header style={headerStyle}> <Button onClick={() => {
                    sider ? setSider(false) : setSider(true)
                }}>
                    <FontAwesomeIcon icon={sider ? faMinus : faPlus}/>
                </Button>
                    <StoryList/>
                </Header>
                <Content style={contentStyle}>
                    <MemeFeed/>
                </Content>
            </Layout>
        </Layout>
    </HomeContextProvider>)
}

export default Home
