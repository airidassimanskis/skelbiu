import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const auth = getAuth()

function createNavBar() {
    let container = document.querySelector(".main-container")
    let nav_container = document.createElement("nav")
    nav_container.classList = "navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-around"



    // Sign out function
    const signOutBtn = document.createElement("button")
    signOutBtn.textContent = "Sign Out"
    signOutBtn.classList = "signOut btn btn-danger btn-sm nav-btn"
    
    let signOutFunc = () => {
        signOut(auth).then(() => {
            window.location.reload()

            alertify.success("Successfully logged out.") // NEVEIKIA KAZKODEL
        }).catch((error) => {
            const errorMessage = error.message;
            alertify.error("Logout unsuccessful. If this issue persists please contact an Admin.")
        });
    }
    signOutBtn.addEventListener("click", signOutFunc)
    
    // Home function
    const home = document.createElement("button")
    home.classList = "btn btn-primary btn-sm nav-btn nav-home"
    home.textContent = "Home"

    // My posts function
    const myPosts = document.createElement("button")
    myPosts.classList = "btn btn-primary btn-sm nav-btn nav-myposts"
    myPosts.textContent = "My Posts"

    // Favorites function
    const myFavorites = document.createElement("button")
    myFavorites.classList = "btn btn-primary btn-sm nav-btn nav-myfavorites"
    myFavorites.textContent = "Favorites"


    // Appends
    nav_container.appendChild(home)
    nav_container.appendChild(myPosts)
    nav_container.appendChild(myFavorites)
    nav_container.appendChild(signOutBtn)
    container.appendChild(nav_container)
}

export default createNavBar