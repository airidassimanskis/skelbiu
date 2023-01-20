import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const auth = getAuth()

function createNavBar() {
    let container = document.querySelector(".main-container")
    let nav_container = document.createElement("nav")
    nav_container.classList = "navbar navbar-expand-lg navbar-light bg-light"



    // Sign out function
    const signOutBtn = document.createElement("button")
    signOutBtn.textContent = "Sign Out"
    signOutBtn.classList = "signOut btn btn-primary btn-md"
    
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
    signOutBtn.addEventListener("click", signOutFunc)
    
    // Appends
    nav_container.appendChild(signOutBtn)
    container.appendChild(nav_container)
}

export default createNavBar