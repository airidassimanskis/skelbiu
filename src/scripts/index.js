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

        createNavBar()
        onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {

            let user = snapshot.val()
            if (user.role === "admin"){
                alertify.warning("Logged in as admin")
                adminPanel()
            }})
        addAdFields()


    } else {

        // rodyti register
        document.querySelector(".login-register-form").style.visibility = "visible";

        // register func
        let registerNewUserFunc = () => {
            const first_name = document.getElementById("register_first_name").value
            const last_name = document.getElementById("register_last_name").value
            const email = document.getElementById("register_email").value
            const phone = document.getElementById("register_phone").value
            const password = document.getElementById("register_password").value

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // signed in
                    const user = userCredential.user

                    

                    const createdAt = new Date().toISOString()
                    set(ref(database, "users/" + user.uid), {
                        role: "user",
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
                    alertify.error("Registration unsuccessful. Please check if the information is correct.")
                })
        }

        document.getElementById("signUp").addEventListener("click", registerNewUserFunc)
        document.querySelectorAll(".register_input").forEach(inp => inp.addEventListener("keydown", (e) => {
            if (e.code === "Enter") {registerNewUserFunc()}
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
                    alertify.error("Login unsuccessful. Please check if the information is correct.")
                });
        }

        document.getElementById("signIn").addEventListener("click", signInFunc)
        document.querySelectorAll(".login_input").forEach(inp => inp.addEventListener("keydown", (e) => {
            if (e.code === "Enter") {signInFunc()}
        }))
    }
})
