import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth()
// Firebase end

let container = document.querySelector(".main-container")

function addAdFields() {
    let ad_form = document.createElement("form")
    ad_form.classList = "ad-form"

    let ad_title = document.createElement("input")
    ad_title.classList = "form-control form-control-lg m-3"
    ad_title.type = "text"
    ad_title.placeholder = "Title"

    let ad_description = document.createElement("textarea")
    ad_description.classList = "form-control form-control-lg m-3"
    ad_description.rows = 3
    ad_description.placeholder = "Description"
    ad_description.style = "resize: none;"

    ad_form.appendChild(ad_title)
    ad_form.appendChild(ad_description)
    container.appendChild(ad_form)
}

export default addAdFields