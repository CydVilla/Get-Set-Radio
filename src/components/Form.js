import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import React, { useState, useContext } from "react";
import { UserContext } from "./context/UserContext";

const FILE_UPLOAD_PREFIX_REGEX = /data[^,]*,/;

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [art, setArt] = useState({ fileName: "", file: "" });
  const [audio, setAudio] = useState({ fileName: "", file: "" });
  const [{ token }] = useContext(UserContext);

  const fileUploadHandler = (event, name) => {
    const reader = new FileReader();
    const targetFile =
      event && event.target && event.target.files && event.target.files[0];
    let uploadedFile;
    reader.onload = (fileReaderEvent) => {
      uploadedFile = fileReaderEvent.target.result;
    };
    reader.onloadend = () => {
      if (name == "art") {
        setArt({ fileName: targetFile.name, file: uploadedFile });
      } else {
        setAudio({ fileName: targetFile.name, file: uploadedFile });
      }
    };
    reader.readAsDataURL(targetFile);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later.";
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/upload", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, artist, art, year, audio }),
    })
      .then((response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!");
          } else if (response.status === 401) {
            setError("Invalid");
          } else {
            setError(genericErrorMessage);
          }
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
      });
  };
  return (
    <>
      <form onSubmit={formSubmitHandler} className="music-form">
        <FormGroup label="Title" labelFor="title">
          <InputGroup
            id="title"
            placeholder="title"
            type="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Artist" labelFor="artist">
          <InputGroup
            id="artist"
            placeholder="Artist"
            type="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Year" labelFor="year">
          <InputGroup
            id="year"
            placeholder="year"
            type="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Album Art" labelFor="art">
          <InputGroup
            id="art"
            placeholder="Album Art"
            type="file"
            onChange={(e) => fileUploadHandler(e, "art")}
          />
        </FormGroup>
        <FormGroup label="file" labelFor="file">
          <InputGroup
            id="file"
            placeholder="File"
            type="file"
            onChange={(e) => fileUploadHandler(e, "file")}
          />
        </FormGroup>
        <Button
          intent="primary"
          disabled={isSubmitting}
          text={`${isSubmitting ? "Rad" : "Submit"}`}
          fill
          type="submit"
        />
      </form>
    </>
  );
};

export default Form;
