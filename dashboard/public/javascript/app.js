function manage(txt) {
    let bt = document.getElementById("newProjectButton");
    bt.disabled = txt.value === "";
}
