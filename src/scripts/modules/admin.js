import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth()
// Firebase end

let container = document.querySelector(".main-container")

export function adminPanel() {
    onValue(ref(database, "users/"), (snapshot) => {
        let users = snapshot.val()

        let admin_panel_div = document.createElement("div")
        admin_panel_div.classList = "m-3 d-flex justify-content-around"

        let admin_panel_h2 = document.createElement("h2")
        admin_panel_h2.textContent = "Admin Panel"
        admin_panel_div.appendChild(admin_panel_h2)

        for (let u in users){
            onValue(ref(database, "users/" + u), (snapshot) => {
                let user = snapshot.val()

                console.log(user.user_email)
                let admin_users_tr = document.createElement("tr")
                let admin_users_th = document.createElement("th")

                admin_users_th.textContent = user.user_email

                admin_users_tr.appendChild(admin_users_th)
                admin_panel_div.appendChild(admin_users_tr)
        })}


        container.appendChild(admin_panel_div)

    })
}