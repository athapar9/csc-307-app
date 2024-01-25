// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => { console.log(error); });
    }, [] );

    function postUser(person) {
      const promise = fetch("Http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
  
      return promise;
    }

    // src/MyApp.js (a new inner function inside MyApp())
    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function updateList(person) { 
    postUser(person)
      .then((response) => {
        if (response.status === 201){
            response.json().then((data) => {
                setCharacters([...characters, data]);
            })
        }else{
            console.log("Cannot be Updated");
        }
    })
      .catch((error) => {
        console.log(error);
      })
    }

    function deleteUser(id){
      const promise = fetch("http://localhost:8000/users/" + id, {
          method: "DELETE",
      });
      return promise;
  }

    function removeOneCharacter (index) {
        const id = characters.at(index).id;
        deleteUser(id).then((response) =>{
            if (response.status === 204){
                const updated = characters.filter((character, i) => {
                    return i !== index
                });
                setCharacters(updated);
            }else{
                console.log("Unable to delete user");
            }
        });
    }
  
    return (
      <div className="container">
        <Table
          characterData={characters}
          removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
      </div>
    );
  }

    

export default MyApp;