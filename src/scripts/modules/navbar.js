import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const auth = getAuth()

function createNavBar() {
    let container = document.querySelector(".main-container")
    let nav_container = document.createElement("nav")
    nav_container.classList = "navbar navbar-expand-lg navbar-light bg-light"



    // Sign out function
    const signOutBtn = document.createElement("button")
    signOutBtn.textContent = "Sign Out"
    signOutBtn.classList = "signOut btn btn-primary btn-sm float-end"
    
    let signOutFunc = () => {
        signOut(auth).then(() => {
            window.location.reload()

            alertify.success("Successfully logged out.") // NEVEIKIA KAZKODEL
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alertify.error("Logout unsuccessful. If this issue persists please contact an Admin.")
        });
    }
    signOutBtn.addEventListener("click", signOutFunc)
    
    // Appends
    nav_container.appendChild(signOutBtn)
    container.appendChild(nav_container)
}

export default createNavBar