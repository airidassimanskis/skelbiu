import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
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

    onValue(ref(database, "skelbimai/"), (snapshot) => {
        let ads = snapshot.val()

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
        ad_price.type = "number"
        ad_price.classList = "form-control form-control-lg m-3"
        ad_price.placeholder = "$ 0.00"

        let ad_phone = document.createElement("input")
        ad_phone.classList = "form-control form-control-lg m-3"
        ad_phone.placeholder = "+1234567890"

        let ad_email = document.createElement("input")
        ad_email.classList = "form-control form-control-lg m-3"
        ad_email.placeholder = `${auth.currentUser.email}`
        ad_email.disabled = true

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


        ad_submit.addEventListener("click", AddTheAdToTheBaghdad)

        function AddTheAdToTheBaghdad() {
            const createdAt = Math.round(Date.now() / 1000)
            const adUID = new Date().toISOString() + Math.random().toString(36)
            set(ref(database, "skelbimai/" + auth.currentUser.uid), {
                title: ad_title.value,
                description: ad_description.value,
                city: ad_city_select.value,
                price: ad_price.value,
                phone: ad_phone.value,
                email: ad_email.placeholder,
                created_at: `${createdAt}`,
                created_by: auth.currentUser.uid
            })

            alertify.success("Successfully created a new ad.")
        }

        for (let key in ads) {
            let ad = ads[key]
            console.log(ad)


            let ad_display_container = document.createElement("div")
            ad_display_container.classList = ""

            let ad_card_div = document.createElement("div")
            ad_card_div.classList = "card m-3"

            let ad_card_body = document.createElement("div")
            ad_card_body.classList = "card-body"

            let ad_card_title = document.createElement("h4")
            ad_card_title.classList = "card-title"
            ad_card_title.textContent = "FAVORITE SIRDELE " + ad.title

            let ad_card_description = document.createElement("p")
            ad_card_description.classList = "card-text"
            ad_card_description.textContent = ad.description

            let ad_card_phone = document.createElement("h5")
            ad_card_phone.classList = "card-text"
            ad_card_phone.textContent = ad.phone

            let ad_card_price = document.createElement("h3")
            ad_card_price.classList = "card-text"
            ad_card_price.textContent = "$" + ad.price

            let ad_card_footer = document.createElement("div")
            ad_card_footer.classList = "card-footer text-muted"
            ad_card_footer.textContent = ad.created_at

            ad_card_div.appendChild(ad_card_body)
            ad_card_body.appendChild(ad_card_title)
            ad_card_body.appendChild(ad_card_description)
            ad_card_body.appendChild(ad_card_phone)
            ad_card_body.appendChild(ad_card_price)
            ad_card_div.appendChild(ad_card_footer)
            container.appendChild(ad_card_div)
            container.appendChild(ad_display_container)
        }
    })


}

export default addAdFields