import React, { useEffect, useState } from 'react'
import axios from 'axios';
const AllUser = () => {
const [allusers , serallusers] = useState([]);
    useEffect(() => {




        axios.get("http://localhost:3001/all-user")
          .then((response) => {
            serallusers(response.data); // Log the successful response
          })
          .catch((error) => {
            console.error("Error fetching data: ", error); // Log the error
            alert("There was an error fetching the data!");
          });
      }, []);

  return (




    <div>
      All the users :
      {
        allusers.map((value)=>{
          return   <h1>{value.email}</h1>
        })
      }
    </div>
  )
}

export default AllUser
