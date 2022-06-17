import { Card, Tab, Tabs } from "@blueprintjs/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { UserContext } from "./components/context/UserContext"
import Loader from "./components/Loader"
import Login from "./components/Login"
import Register from "./components/Register"
import Welcome from "./components/Welcome"
import Player from "./components/Player"
import './App.css';

const App = () => {
  const [currentTab, setCurrentTab] = useState("login")
  const [userContext, setUserContext] = useContext(UserContext)
  const [currentSongIndex,setCurrentSongIndex] = useState(0) 
  const [nextSongIndex,setNextSongIndex] = useState(currentSongIndex + 1);
  const [songs,setSongs] = useState([
    {
        "title": "$tricky_sister",
        "artist": "Hideki Naganuma",
        "album": "Air Gear OST",
        "track": "1",
        "year": "2004",
        "img_src": "/song_art/tricky_sister_art.jpg",
        "src": "/songs/tricky_sister.mp3"
  },
    {
      "title": "Fly Like a Butterfly",
      "artist": "SEGA",
      "album": "Jet Set Radio OST",
      "track": "2",
      "year": "2001",
      "img_src": "/song_art/tricky_sister_art.jpg",
      "src": "/songs/Jet Set Radio Future - Fly Like a Butterfly.mp3"
    }
])
 
  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, token: null }
        })
      }
      setTimeout(verifyUser, 5 * 60 * 1000)
    })
  }, [setUserContext])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])
  const syncLogout = useCallback(event => {
    if (event.key === "logout") {
      //history.push("/")
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  useEffect(()=>{
    setNextSongIndex(()=>{
    if (currentSongIndex + 1 >songs.length - 1 ){
      return 0;
    } else{
      return currentSongIndex + 1;
    }
  });
  },[currentSongIndex])

  return userContext.token === null ? (
    <Card elevation="1">
      <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id="login" title="Login" panel={<Login />} />
        <Tab id="register" title="Register" panel={<Register />} />
        <Tabs.Expander />
      </Tabs>
    </Card>
  ) : userContext.token ? (
    <div>
      <Welcome/>
      <Player currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} nextSongIndex={nextSongIndex} songs={songs} />
    </div>
  ) : (
    <Loader />
  )
}

export default App
