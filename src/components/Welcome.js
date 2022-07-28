import { Button, Card } from "@blueprintjs/core"
import React, { useCallback, useContext, useEffect } from "react"
import { UserContext } from "./context/UserContext"
import Loader from "./Loader"

const Welcome = () => {
  const [userContext, setUserContext] = useContext(UserContext)

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, details: data }
        })
      } else {
        if (response.status === 401) {
          window.location.reload()
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, details: null }
          })
        }
      }
    })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    if (!userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      setUserContext(oldValues => {
        return { ...oldValues, details: undefined, token: null }
      })
      window.localStorage.setItem("logout", Date.now())
    })
  }

  const refetchHandler = () => {
    setUserContext(oldValues => {
      return { ...oldValues, details: undefined }
    })
  }

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <Card className="welcome" elevation="1">
      <div className="user-details">
        <div>
          <p>
            Welcome&nbsp;
            <strong>
              {userContext.details.firstName}
              {userContext.details.lastName &&
                " " + userContext.details.lastName}
            </strong>!
          </p>
          <p>
            {/* Your reward points: <strong>{userContext.details.points}</strong> */}
          </p>
        </div>
        <div className="user-actions">
          <Button
            text="Logout"
            onClick={logoutHandler}
            minimal
            intent="primary"
          />
        </div>
      </div>
    </Card>
  )
}

export default Welcome
