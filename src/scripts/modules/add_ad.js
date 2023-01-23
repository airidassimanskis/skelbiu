import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth()
// Firebase end

let container = document.querySelector(".main-container")

let cities = [
    "Vilnius",
    "Kaunas",
    "Klaipeda",
    "Siauliai",
    "Panevezys",
    "Birzai"
]

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

    let ad_div = document.createElement("div")
    ad_div.classList = "d-flex justify-content-between form-control form-control-lg m-3"

    let ad_city_select = document.createElement("select")
    ad_city_select.classList = "form-control form-control-lg m-3"

    for (let i = 0; cities.length > i; i++) {
        var ad_city_option = document.createElement('option')
        ad_city_option.innerHTML = cities[i]
        ad_city_select.appendChild(ad_city_option)
    }


    let ad_price = document.createElement("input")
    ad_price.classList = "form-control form-control-lg m-3"
    ad_price.placeholder = "$ | kad butu kaireje toks skirtukas padaryk ir mazesni size inputo"
    
    let ad_phone = document.createElement("input")
    ad_phone.classList = "form-control form-control-lg m-3"
    ad_phone.placeholder = "is database idek phone num ir disabled padaryk"
    
    let ad_email = document.createElement("input")
    ad_email.classList = "form-control form-control-lg m-3"
    ad_email.placeholder = "is database idek email ir disabled padaryk"




    let ad_submit = document.createElement("button")
    ad_submit.classList = "btn btn-success btn-lg form-control form-control-lg m-3"
    ad_submit.textContent = "Post Ad"

    ad_form.appendChild(ad_title)
    ad_form.appendChild(ad_description)

    // price city flex
    ad_div.appendChild(ad_city_select)
    ad_div.appendChild(ad_price)

    ad_form.appendChild(ad_div)
    ad_form.appendChild(ad_phone)
    ad_form.appendChild(ad_email)
    ad_form.appendChild(ad_submit)

    container.appendChild(ad_form)
}

export default addAdFields