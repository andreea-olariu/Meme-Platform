import React, {createContext, useEffect, useState} from "react"
import {db} from "../utils/firebase"
import {toast} from "react-toastify";

export const HomeContext = createContext()

export default function HomeContextProvider({children}) {
    const [memes, setMemes] = useState([])
    const [users, setUsers] = useState([])
    const [stories, setStories] = useState([])
    const showToastLovedMeme = () => {
        toast.success('You have loved this meme!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const showToastSavedMeme = () => {
        toast.success('You have saved this meme!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {

            const today = new Date();
            const storiesTmp = []
            const usersTmp = []

            snapshot.docs.forEach((doc) => {
                const story = doc.data().story
                const storyAdded = doc.data().storyAdded
                if (story) {
                    const dateStoryAdded = Date.parse(storyAdded)
                    const diff = today - dateStoryAdded
                    /* 86400001 = one day
                    *  if the story was set more that one day ago, delete it
                    * */
                    if (diff < 86400001) {
                        storiesTmp.push({
                            story,
                            username: doc.data().username,
                            avatarUrl: doc.data().avatarUrl,
                            storyAdded
                        })
                    } else {
                        db.collection("users").doc(doc.id).update({
                            story: "",
                            storyAdded: ""
                        })
                    }
                }

                const user = doc.data()
                if (user) {
                    usersTmp.push(user)
                }
            })

            setStories(storiesTmp)
            setUsers(usersTmp)
        })
        db.collection("memes").onSnapshot((snapshot) => {
            const memesTmp = []
            snapshot.docs.forEach((doc) => {
                const meme = doc.data()
                memesTmp.push({
                    meme,
                    docId: doc.id
                })
            })
            setMemes(memesTmp)
        })

    }, [])


    return (
        <HomeContext.Provider
            value={{
                memes,
                stories,
                users,
                showToastLovedMeme,
                showToastSavedMeme
            }}
        >
            {children}
        </HomeContext.Provider>
    )
}