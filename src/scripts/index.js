// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./config/firebase.js"
import { getDatabase, set, update, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth()
// Firebase end

let container = document.querySelector(".container")

onAuthStateChanged(auth, (user) => {
    if (user) {
        //istrinti register
        document.querySelector(".login-register-form").remove()


        // Sign out func
        const lastLoginAt = new Date().toISOString()
        update(ref(database, "users/" + user.uid), {
            last_seen: `${lastLoginAt}`
        })

        let signOutFunc = () => {
            signOut(auth).then(() => {
                window.location.reload();
                console.log("User successfully logged out")
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
        }
        document.getElementById("signOut").addEventListener("click", signOutFunc)

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
                })
                .catch((error) => {
                    const errorCode = error.errorCode
                    const errorMessage = error.message
                    alert(errorMessage)
                })
        }
        document.getElementById("signUp").addEventListener("click", registerNewUserFunc)
        
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

                    console.log("User successfully logged in")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage)
                });
        }

        document.getElementById("signIn").addEventListener("click", signInFunc)
    }
})







// let createNewSkelbima = () => {
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             // User is signed in, see docs for a list of available properties
//             // https://firebase.google.com/docs/reference/js/firebase.User
//             const uid = user.uid;

//             const createdAt = new Date().toISOString()
//             set(ref(database, "skelbimai/" + user.uid), {
//                 user: user.uid,
//                 title: skelbimo_title,
//                 description: skelbimo_description,
//                 price: skelbimo_price,
//                 created_at: `${createdAt}`
//             })

//         } else {
//             // User is signed out
//             // ...
//         }
//     });


// let checkIfLogged = () => {
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             console.log("logged in")
//         } else {
//             console.log("not logged in")
//         }
//     })
// };
// setInterval(checkIfLogged, 1000)