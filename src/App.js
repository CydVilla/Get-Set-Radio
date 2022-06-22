import React, { Component } from 'react'
import { Card, Tab, Tabs } from "@blueprintjs/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { UserContext, UserProvider } from "./components/context/UserContext"
import Loader from "./components/Loader"
import Login from "./components/Login"
import Register from "./components/Register"
import Welcome from "./components/Welcome"
import Player from "./components/Player"
import Form from "./components/Form"
import {UserEdit} from "./components/UserEdit"
import ParticlesBg from 'particles-bg'
import {UserSongs} from "./components/UserSongs"
// import Header from "./components/Header"
import './App.css';

const App = () => {
  const [userContext, setUserContext] = useContext(UserContext)
  const [currentTab, setCurrentTab] = useState("login")
  const [currentSongIndex,setCurrentSongIndex] = useState(0) 
  const [nextSongIndex,setNextSongIndex] = useState(currentSongIndex + 1)
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([
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

useEffect(() => {
  fetch(process.env.REACT_APP_API_ENDPOINT + "users/getSongs", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).then(res => {
    console.log(res)
    return res.json()
  }).then((res) => {
    console.log(res, '!')
    setSongs(previousState => {
      const newSongs = res.map(song => {
        return  {
          "user": song.user,
          "title": song.title,
          "artist": song.artist,
          "album": "",
          "track": "",
          "year": song.year,
          "img_src": song.albumArt,
          "src": song.src
        }
      })
      return [...previousState, ...newSongs]
    })
  })
},[setUserContext])
 
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
    if (currentSongIndex + 1 > songs.length - 1 ){
      return 0;
    } else{
      return currentSongIndex + 1;
    }
  });
  },[currentSongIndex])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 30000);
    }, []);

    const EventHandler = true

    const handleClick = () => {
      setTimeout(() => {
        setLoading(false)
    }, 1);
    };
    let config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      // body: "./img/icon.png", // Whether to render pictures
      // rotate: [0, 20],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "center", // all or center or {x:1,y:1,width:100,height:100}
      color: ["random", "black"],
      cross: "dead", // cross or bround
      random: 15,  // or null,
      g: 5,    // gravity
      // f: [2, -1], // force
      onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
      }
    };

    useEffect(() => {
    if (userContext?.details?.firstName) {
      setCurrentTab("Player")
    }
    },[userContext?.details?.firstName])

    console.log(currentTab)
    console.log(userContext)

  return ( 
    loading ?
    <div className="loader-container">
      <button onClick={EventHandler ? handleClick : undefined}>
        Enter</button>
    </div>
  : userContext.token === null ? 
  (
    <Card elevation="1">
      <ParticlesBg type="custom" config={config} bg={true}/>
      <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id="login" title="Login" panel={<Login />} />
        <Tab id="register" title="Register" panel={<Register />} />
        <Tabs.Expander />
      </Tabs>
    </Card>
  ) : userContext.token ? (
    <div>
      {/* <Header/> */}
      <Card elevation="1">
      <Welcome/>
      <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id="Player" title="Player" panel={ <Player currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} nextSongIndex={nextSongIndex} songs={songs} />
} />
        <Tab id="edit" title="See Music" panel={<UserEdit/>} />
        <Tab id="form" title="Upload Music" panel={<Form/>} />
        <Tab id="get" title="See All Music" panel={<UserSongs/>} />
        <Tabs.Expander />
      </Tabs>
    </Card>
    </div>
  ) : (
    <Loader />
  )

  )
}

export default App
