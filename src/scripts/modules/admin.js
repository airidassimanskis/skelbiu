import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
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
        admin_panel_div.classList = "m-3 d-flex justify-content-around admin-panel-div"

        let admin_panel_h2 = document.createElement("h2")
        admin_panel_h2.textContent = "Admin Panel"
        admin_panel_h2.classList = "text-center"
        admin_panel_div.appendChild(admin_panel_h2)

        // Categories function
        let add_categories_input = document.createElement("input")
        add_categories_input.classList = "form-control"

        let add_categories_button = document.createElement("button")
        add_categories_button.classList = "m-2 btn btn-success"
        add_categories_button.textContent = "Add category to the database"

        admin_panel_h2.appendChild(add_categories_input)
        admin_panel_h2.appendChild(add_categories_button)



        // display all categories

        onValue(ref(database, "categories/"), (snapshot) => {
            let categories = snapshot.val()

            let cat_tr = document.createElement("tr")
            cat_tr.classList = "admin-users"

            for (let c in categories) {
                let cat_th = document.createElement("th")
                cat_th.innerHTML = c

                let cat_del = document.createElement("button")
                cat_del.classList = "m-1 btn btn-danger btn-sm admin-button"
                cat_del.textContent = "DELETE"


                // delete category
                function deleteCategory() {
                    remove(ref(database, "categories/" + c))
                    window.location.reload()
                    alertify.success("Category deleted successfully")
                }
                admin_panel_div.appendChild(cat_tr)
                
                cat_del.addEventListener("click", deleteCategory)
                cat_tr.appendChild(cat_th)
                cat_th.appendChild(cat_del)
            }
            
            add_categories_button.addEventListener("click", function () {
                set(ref(database, "categories/" + add_categories_input.value), {
                    category_name: add_categories_input.value
                })
                alertify.success("Category added successfully")
            })


            // user ban function
            let admin_users_tr = document.createElement("tr")
            admin_users_tr.classList = "admin-users"

            for (let u in users) {
                onValue(ref(database, "users/" + u), (snapshot) => {
                    let user = snapshot.val()

                    if (user.banned == false) {

                        let admin_users_th = document.createElement("th")
                        admin_users_th.textContent = user.user_email

                        // BAN USER FUNCTION
                        let admin_ban_user = document.createElement("button")
                        admin_ban_user.classList = "m-1 btn btn-danger btn-sm admin-button"
                        admin_ban_user.textContent = "BAN"

                        function ban_user_func() {
                            if (user.role === "admin") {
                                alertify.error("Can't ban admins lil bro 💀")
                            } else {
                                update(ref(database, "users/" + u), {
                                    banned: true
                                })
                                alertify.success(`Successfully banned ${user.user_email}`)
                                admin_ban_user.disabled = true

                            }
                        }

                        admin_ban_user.addEventListener("click", ban_user_func)


                        admin_users_th.appendChild(admin_ban_user)
                        admin_users_tr.appendChild(admin_users_th)
                        admin_panel_div.appendChild(admin_users_tr)
                    }
                })
            }
        })
        container.appendChild(admin_panel_div)
    })
}