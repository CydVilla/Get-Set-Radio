import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { UserProvider } from "./components/context/UserContext"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)
