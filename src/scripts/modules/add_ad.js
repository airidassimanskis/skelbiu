import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { firebaseConfig } from "./firebase.js"
import { getDatabase, set, update, push, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import createNavBar from "./navbar.js"
import { adminPanel } from "./admin.js"

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
    container.innerHTML = ""
    createNavBar()
    onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {
        let user = snapshot.val()

        if (user.role == "admin") {
            adminPanel()
        }
    })

    onValue(ref(database, "skelbimai/"), (snapshot) => {
        let ads = snapshot.val()

        let ad_form = document.createElement("form")
        ad_form.classList = "mt-3 ad-form-div"

        let ad_title = document.createElement("input")
        ad_title.classList = "form-control form-control-lg m-3"
        ad_title.type = "text"
        ad_title.placeholder = "Title"
        ad_title.id = "ad_title"

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
            let ad_city_option = document.createElement('option')
            ad_city_option.innerHTML = cities[i]
            ad_city_select.appendChild(ad_city_option)
        }


        let ad_price = document.createElement("input")
        ad_price.type = "number"
        ad_price.classList = "form-control form-control-lg m-3"
        ad_price.placeholder = "$ 0"

        let ad_category_select = document.createElement("select")
        ad_category_select.classList = "form-control form-control-lg m-3"

        onValue(ref(database, "categories/"), (snapshot) => {
            let categories = snapshot.val()
            for (let c in categories) {
                let ad_categories_option = document.createElement('option')
                ad_categories_option.innerHTML = c
                ad_category_select.appendChild(ad_categories_option)
            }
        })


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

        ad_title.required = true
        ad_description.required = true
        ad_city_select.required = true
        ad_price.required = true
        ad_phone.required = true

        let your_favs = document.createElement("h2")
        your_favs.classList = "m-3"
        your_favs.innerHTML = "Your Favorites"

        let your_favs_ul = document.createElement("ul")
        your_favs_ul.classList = "list-group m-3"



        ad_form.appendChild(ad_title)
        ad_form.appendChild(ad_description)

        // price city flex
        ad_div.appendChild(ad_city_select)
        ad_div.appendChild(ad_price)

        ad_form.appendChild(ad_div)
        ad_form.appendChild(ad_category_select)
        ad_form.appendChild(ad_phone)
        ad_form.appendChild(ad_email)
        ad_form.appendChild(ad_submit)

        container.appendChild(ad_form)

        your_favs.appendChild(your_favs_ul)
        container.appendChild(your_favs)

        function AddTheAdToTheBaghdad() {
            if (!ad_title.value.trim() || !ad_description.value.trim() || !ad_price.value.trim() || !ad_phone.value.trim()) {
                alertify.error("All fields are required. Please fill in all the fields.")
                return
            }
            if (ad_title.value.trim().length > 50) {
                alertify.error("Title is too long. Maximum amount of characters is 50.")
                return
            }
            if (ad_phone.value.trim().length > 20) {
                alertify.error("Phone number is too long. Maximum amount of characters is 20.")
                return
            }
            if (ad_description.value.trim().length > 300) {
                alertify.error("Description is too long. Maximum amount of characters is 300")
                return
            }
            if (ad_price.value.trim().length > 6) {
                alertify.error("Price is too long. Maximum amount of characters is 6")
                return
            }

            const createdAt = Math.round(Date.now() / 1000)
            push(ref(database, "skelbimai/"), {
                title: ad_title.value,
                description: ad_description.value,
                city: ad_city_select.value,
                category: ad_category_select.value,
                price: ad_price.value,
                phone: ad_phone.value,
                email: ad_email.placeholder,
                created_at: `${createdAt}`,
                created_by: auth.currentUser.uid
            })

            alertify.success("Successfully created a new ad.")
            window.location.reload()
        }


        function getRelativeTime(timestamp) {
            const currentTime = Date.now() / 1000;
            const timeDiff = currentTime - timestamp;

            if (timeDiff < 60) {
                return `${Math.round(timeDiff)} seconds ago`;
            } else if (timeDiff < 3600) {
                return `${Math.round(timeDiff / 60)} minutes ago`;
            } else if (timeDiff < 86400) {
                return `${Math.round(timeDiff / 3600)} hours ago`;
            } else {
                return `${Math.round(timeDiff / 86400)} days ago`;
            }
        }

        function formatCurrency(number) {
            return new Intl.NumberFormat('en-US', { useGrouping: true, maximumFractionDigits: 2 }).format(number);
        }


        ad_submit.addEventListener("click", AddTheAdToTheBaghdad)

        let current_posts_text = document.createElement("h2")
        current_posts_text.textContent = "Current posts by other users"
        current_posts_text.classList = "m-3"
        container.appendChild(current_posts_text)

        // filter by category
        let category_filter = document.createElement("select")
        category_filter.classList = "form-control m-auto w-50"

        let category_filter_option = document.createElement('option')
        category_filter_option.innerHTML = "All"
        category_filter.appendChild(category_filter_option)

        onValue(ref(database, "categories/"), (snapshot) => {
            let categories = snapshot.val()
            for (let c in categories) {
                let category_filter_option = document.createElement('option')
                category_filter_option.innerHTML = c
                category_filter.appendChild(category_filter_option)
            }
        })

        // // filter by city
        // let city_filter = document.createElement("select")
        // city_filter.classList = "form-control m-auto w-50"

        // let city_filter_option = document.createElement('option')
        // city_filter_option.innerHTML = "All"
        // city_filter.appendChild(city_filter_option)

        // for (let c in cities) {
        //     let city_filter_option = document.createElement('option')
        //     city_filter_option.innerHTML = cities[c]
        //     city_filter.appendChild(city_filter_option)
        // }


        // current_posts_text.appendChild(city_filter)
        current_posts_text.appendChild(category_filter)


        let ads_container = document.createElement("div")
        ads_container.classList = "ads-container"

        category_filter.addEventListener("change", function() {
            ads_container.innerHTML = ""
            your_favs_ul.innerHTML = ""
            let selectedCategory = category_filter.value;
            let filteredAds = {};
            for (let key in ads) {
                let ad = ads[key]
                if (selectedCategory == "All" || ad.category == selectedCategory) {
                    filteredAds[key] = ad

                    let ad_card_div = document.createElement("div")
                    ad_card_div.classList = "card m-3"

                    let ad_card_body = document.createElement("div")
                    ad_card_body.classList = "card-body"

                    // favorite button func
                    let ad_card_title = document.createElement("h4")
                    ad_card_title.classList = "card-title"
                    ad_card_title.innerHTML = `${ad.title}<b> • ${ad.category} • ${ad.city}</b>`
                    ad_card_title.id = key

                    onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {
                        let user = snapshot.val()

                        // favorite button func
                        let ad_favorite_btn = document.createElement("button")
                        if (user.favorites && user.favorites[key] && user.favorites[key].favorited_ad) {
                            ad_favorite_btn.classList = "favorite-btn btn bg-warning"
                            ad_favorite_btn.addEventListener("click", () => {
                                remove(ref(database, "users/" + auth.currentUser.uid + "/favorites/" + key))
                            })
                        } else {
                            ad_favorite_btn.classList = "favorite-btn btn bg-secondary"
                            ad_favorite_btn.addEventListener("click", () => {
                                set(ref(database, "users/" + auth.currentUser.uid + "/favorites/" + key), {
                                    favorited_ad: true
                                })
                            })
                        }
                        ad_card_title.appendChild(ad_favorite_btn)

                        if (ad.created_by == auth.currentUser.uid || user.role == "admin") {
                            ad_favorite_btn.hidden = true

                            // edit own ad func
                            let ad_edit_btn = document.createElement("a")
                            ad_edit_btn.classList = "edit-btn btn btn-sm bg-primary"
                            ad_edit_btn.innerHTML = "Edit"
                            ad_edit_btn.href = "#ad_title"

                            ad_edit_btn.addEventListener("click", () => {
                                ad_title.value = ad.title
                                ad_description.value = ad.description
                                ad_city_select.value = ad.city
                                ad_price.value = ad.price
                                ad_category_select.value = ad.category
                                ad_phone.value = ad.phone

                                ad_submit.textContent = "Edit Ad"

                                ad_submit.addEventListener("click", () => {
                                    update(ref(database, "skelbimai/" + key), {
                                        title: ad_title.value,
                                        description: ad_description.value,
                                        city: ad_city_select.value,
                                        category: ad_category_select.value,
                                        price: ad_price.value,
                                        phone: ad_phone.value,
                                        email: ad_email.placeholder,
                                    })
                                    remove(ref(database, "skelbimai/" + key))
                                    window.location.reload()
                                })
                            })
                            ad_card_title.appendChild(ad_edit_btn)
                        }

                    })

                    let ad_card_description = document.createElement("p")
                    ad_card_description.classList = "card-text"
                    ad_card_description.textContent = ad.description

                    let ad_card_phone = document.createElement("h4")
                    ad_card_phone.classList = "card-text"
                    ad_card_phone.innerHTML = '<i class="bi bi-phone"></i>' + ad.phone

                    let ad_card_price = document.createElement("h4")
                    ad_card_price.classList = "card-text"
                    ad_card_price.innerHTML = '<i class="bi bi-currency-dollar"></i>' + formatCurrency(ad.price)

                    let ad_card_footer = document.createElement("div")
                    ad_card_footer.classList = "card-footer text-muted"
                    ad_card_footer.textContent = getRelativeTime(ad.created_at)

                    // remove ad func
                    onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {
                        let user = snapshot.val()
                        if (user.role == "admin" || ad.created_by == auth.currentUser.uid) {

                            ad_card_footer.innerHTML = `${getRelativeTime(ad.created_at)} <b style="position: absolute; right: 15px;">${ad.email}</b>`

                            let admin_delete_ad = document.createElement("button")
                            admin_delete_ad.classList = "admin-delete-ad-btn btn btn-danger"
                            ad_card_title.appendChild(admin_delete_ad)

                            function deleteAd() {
                                remove(ref(database, "skelbimai/" + key))
                                window.location.reload()
                            }

                            admin_delete_ad.addEventListener('click', deleteAd)



                        }
                    })


                    // your favorites

                    onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {
                        let user = snapshot.val()

                        if (user.favorites && user.favorites[key] && user.favorites[key].favorited_ad) {
                            let your_favs_li = document.createElement("li")
                            your_favs_li.classList = "list-group-item your-favs-li"
                            your_favs_li.innerHTML = `<a href="#${key}">${ad.title}<b> • ${ad.category} • ${ad.city}</b></a>`

                            your_favs_ul.appendChild(your_favs_li)
                        }
                    })

                    // comment function
                    let ad_comment_body = document.createElement("ul")
                    ad_comment_body.classList = "list-group"

                    let ad_comment_input = document.createElement("input")
                    ad_comment_input.placeholder = "Your comment"
                    ad_comment_input.classList = "list-group-item"

                    let ad_comment_input_submit = document.createElement("button")
                    ad_comment_input_submit.classList = "btn btn-success"
                    ad_comment_input_submit.innerHTML = "Comment"

                    ad_comment_body.appendChild(ad_comment_input)
                    ad_comment_body.appendChild(ad_comment_input_submit)

                    ad_comment_input_submit.addEventListener("click", () => {
                        if (ad_comment_input.value.trim().length > 80) {
                            alertify.error("Comment is too long. Maximum amount of characters is 80")
                            return
                        } else {
                            push(ref(database, "skelbimai/" + key + "/komentarai/"), {
                                content: ad_comment_input.value,
                                created_by: auth.currentUser.uid
                            })
                            window.location.reload()
                        }
                    })

                    onValue(ref(database, "skelbimai/" + key + "/komentarai/"), (snapshot) => {
                        let comment = snapshot.val()
                        let commentsRemove = ad_comment_body.querySelectorAll(".ad-comment-li")

                        // clear comments so it doesn't append on top of each other
                        for (let comrem of commentsRemove) {
                            comrem.remove()
                        }

                        for (let c in comment) {
                            let ad_comment_li = document.createElement("li")
                            ad_comment_li.classList = "list-group-item ad-comment-li"

                            let ad_comment_li_p = document.createElement("p")
                            ad_comment_li_p.classList = "m-0 ad-comment-li-p"
                            ad_comment_li_p.textContent = `Anonymous: ${comment[c].content}`

                            onValue(ref(database, "users/" + auth.currentUser.uid), (snapshot) => {
                                let user = snapshot.val()
                                if (user.role == "admin" || ad.created_by == auth.currentUser.uid) {
                                    let admin_delete_comment = document.createElement("button")
                                    admin_delete_comment.classList = "admin-delete-comment-btn btn btn-danger"
                                    ad_comment_li.appendChild(admin_delete_comment)

                                    function deleteComment() {
                                        remove(ref(database, "skelbimai/" + key + "/komentarai/" + c))
                                        window.location.reload()
                                    }

                                    admin_delete_comment.addEventListener('click', deleteComment)
                                }
                            })

                            ad_comment_li.appendChild(ad_comment_li_p)
                            ad_comment_body.appendChild(ad_comment_li)
                        }


                    })

                    ad_card_div.appendChild(ad_card_body)
                    ad_card_body.appendChild(ad_card_title)
                    ad_card_body.appendChild(ad_card_description)
                    ad_card_body.appendChild(ad_card_phone)
                    ad_card_body.appendChild(ad_card_price)
                    ad_card_div.appendChild(ad_card_footer)
                    ad_card_div.appendChild(ad_comment_body)
                    ads_container.appendChild(ad_card_div)
                    container.appendChild(ads_container)


                }
            }
        })
    })
}

export default addAdFields