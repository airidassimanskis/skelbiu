// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./modules/firebase.js"
import { getDatabase, set, update, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import createNavBar from "./modules/navbar.js"
import addAdFields from "./modules/add_ad.js"
import { adminPanel } from "./modules/admin.js"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth()
// Firebase end


let container = document.querySelector(".main-container")
console.log("labas :)")

onAuthStateChanged(auth, (user) => {
    if (user) {
        //istrinti register
        document.querySelector(".login-register-form").remove()

        const lastLoginAt = new Date().toISOString()
        update(ref(database, "users/" + user.uid), {
            last_seen: `${lastLoginAt}`
        })

        onValue(ref(database, "users/" + user.uid), (snapshot) => {
            let user = snapshot.val()

            if (user.banned == false) {
                createNavBar()

                if (user.role === "admin") {
                    alertify.warning("Logged in as admin")
                    adminPanel()
                }
                addAdFields()
            } else {
                alertify.error("You are currently banned.")
                alertify.error("If you want to appeal your ban please contact the website administrator.")

                const signOutBtn = document.createElement("button")
                signOutBtn.textContent = "Sign Out"
                signOutBtn.classList = "signOut btn btn-danger btn-sm nav-btn"
                container.appendChild(signOutBtn)

                let signOutFunc = () => {
                    signOut(auth).then(() => {
                        window.location.reload()
                    })
                }
                signOutBtn.addEventListener("click", signOutFunc)
            }
        })



    } else {

        // rodyti register
        document.querySelector(".login-register-form").style.visibility = "visible";

        // register func
        let registerNewUserFunc = () => {
            const first_name = document.getElementById("register_first_name").value.trim()
            const last_name = document.getElementById("register_last_name").value.trim()
            const email = document.getElementById("register_email").value.trim()
            const phone = document.getElementById("register_phone").value.trim()
            const password = document.getElementById("register_password").value.trim()

            if (!first_name || !last_name || !email || !phone || !password) {
                alertify.error("All fields are required to successfully register.")
                return
            }

            if (first_name.length > 20 || last_name.length > 20 || phone.length > 20){
                alertify.error("First name, Last name or Phone number is too long. Maximum amount of characters is 20.")
                return
            }
            if (email.length > 35){
                alertify.error("Email is too long. Maximum amount of characters is 35.")
                return
            }
            if (password.length > 65){
                alertify.error("Password is too long. Maximum amount of characters is 65.")
                return
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // signed in
                    const user = userCredential.user



                    const createdAt = new Date().toISOString()
                    set(ref(database, "users/" + user.uid), {
                        role: "user",
                        banned: false,
                        user_email: email,
                        first_name: first_name,
                        last_name: last_name,
                        phone: phone,
                        created_at: `${createdAt}`
                    })

                    console.log("New user successfully registered")
                    alertify.success("Successfully registered.")
                })
                .catch((error) => {
                    const errorMessage = error.message
                    console.log(errorMessage)
                    alertify.error("Registration unsuccessful. Please check if the information is correct." + ` <b>${errorMessage}</b>`)
                })
        }

        document.getElementById("signUp").addEventListener("click", registerNewUserFunc)
        document.querySelectorAll(".register_input").forEach(inp => inp.addEventListener("keydown", (e) => {
            if (e.code === "Enter") { registerNewUserFunc() }
        }))

        // Login func
        let signInFunc = () => {

            const email = document.getElementById("login_email").value
            const password = document.getElementById("login_password").value

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                    const lastLoginAt = new Date().toISOString()
                    update(ref(database, "users/" + user.uid), {
                        last_seen: `${lastLoginAt}`
                    })

                    alertify.success("Successfully logged in.")
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alertify.error("Login unsuccessful. Please check if the information is correct." + ` <b>${errorMessage}</b>`)
                });
        }

        document.getElementById("signIn").addEventListener("click", signInFunc)
        document.querySelectorAll(".login_input").forEach(inp => inp.addEventListener("keydown", (e) => {
            if (e.code === "Enter") { signInFunc() }
        }))
    }
})
