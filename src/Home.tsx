
import { useEffect, useState } from "react";
import Login from "./Login";

type post = {

  id: number,
  text: string,
  image: string,
  liked: boolean
}

function Home () {

const [posts, setposts] = useState<post[]>([])
const [text, settext] = useState<string>("")
const [image, setimage] = useState<string>("")
const [email, setemail] = useState<string>("")
const [password, setpassword] = useState<string>("")
const [editingid, seteditingid] = useState<number | null>(null)

useEffect(() => {

  const loadposts = async () => {

  const response = await fetch("http://localhost:5000/posts")

  const data = await response.json()

    setposts(data)
  }

  loadposts()
},[]);

const bearbeiten = async (id: number) => { 

if (editingid === null) {

const post = posts.find(pst => pst.id === id)

if (!post) return


settext(post.text)
setimage(post.image)
seteditingid(id)
}

else {

const newinfos = {

  text: text,
  image: image,
  id: editingid
}

const response = await fetch(`http://localhost:5000/posts/${editingid}`,{
    
method: "put", 

  headers: {
  "Content-Type": "application/json",
  authorization: localStorage.getItem("token")
  },

body: JSON.stringify(newinfos)
})

const antwort = await response.json()


console.log(antwort)

if (response.ok) {setposts(prev => prev.map(post => post.id === editingid ? {...post, text, image} : post))}

setimage("")
settext("")
seteditingid(null)

}
}





const speichern = async () => {

const newpost = {

  id: Date.now(),
  text: text,
  image: image,
  liked: false
}

const response = await fetch(

"http://localhost:5000/posts",{

  method: "POST",
  headers: {

    "Content-Type": "application/json",
    authorization: localStorage.getItem("token")
  },

  body: JSON.stringify(newpost)
}
)

const savedpost = await response.json()

console.log(savedpost)

setposts(prev => [...prev, savedpost])

settext("")
setimage("")
seteditingid(null)
}


const deletepost = async (id: number) => {

  await fetch(`http://localhost:5000/posts/${id}`, {

    method: "DELETE"
  })

  setposts(prev => prev.filter(post => post.id !== id))
}

const login = async() => {

    const response = await fetch("http://localhost:5000/login", {

        method: "POST",
        headers: {

            "Content-Type" : "application/json",
            
        },

        body: JSON.stringify({email, password})
    })

    const data = await response.json()

    localStorage.setItem("token", data.token)
    
}



  return(

    <div>

      <input type="text"
      value={image}
      placeholder="bild url"
      onChange={(e) => setimage(e.target.value)} />

    <input type="text"
    value={text}
    placeholder="text"
    onChange={(e) => settext(e.target.value)} />

    <button onClick={() => {if (editingid === null) {
  speichern()
  } else{()=> bearbeiten}}}>{editingid === null ? "speichern" : "bearbeiten"}</button>

    <button onClick={login}>login</button>

      {posts.map(pst =>(
        <p key={pst.id}>{pst.text}
        <button onClick={() => deletepost(pst.id)}>löschen</button> 
        <button onClick={() => bearbeiten(pst.id)}>{ editingid === null ? "ändern" : "speichern"}</button></p>
      ))}

      <div>

       <input type="text"
       value={email}
       onChange={(e) => setemail(e.target.value)}
       placeholder="email" />

       <input type="text"
       value={password}
       onChange={(e) => setpassword(e.target.value)}
       placeholder="password" />
      </div>
    </div>

    
  )

}

export default Home






