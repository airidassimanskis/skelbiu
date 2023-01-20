
function modal(title, description) {
    let modal = document.createElement("div")
    modal.classList = "modal"
    modal.tabIndex = "-1"
    
    let modal_dialog = document.createElement("div")
    modal_dialog.classList = "modal-dialog"

    let modal_content = document.createElement("div")
    modal_content.classList = "modal-content"

    let modal_header = document.createElement("div")
    modal_header.classList = "modal-header"
    
    let modal_title = document.createElement("h5")
    modal_title.classList = "modal-title"
    modal_title.textContent = title


    // data-bs-dismiss="modal" aria-label="Close"
    modal_close = document.createElement("button")
    modal_close.classList = "btn-close"
    modal_close.
    modal_close.

    modal_body = document.createElement("div")
    modal_body.classList = "modal-body"

    modal_description = document.createElement("p")
    modal_description.textContent = description

    modal_body.appendChild(modal_description)
    modal_content.appendChild(modal_body)
    modal_header.appendChild(modal_title)
    modal_content.appendChild(modal_header)
    modal_dialog.appendChild(modal_content)
    modal.appendChild(modal_dialog)
}

export default modal