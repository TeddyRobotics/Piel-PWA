const container = document.querySelector(".container")
//  const firmware = []

// const showFirmware = () => {
//     let output = ""
//     firmware.forEach (
//         ({name}) =>
//             (output += `
//                 <div class="card">
//                         <h1 class = "card--title">${name}</h1>
//                 </div>
//                 `)
//     )
//     container.innerHTML = output
// }

document.addEventListener("DOMContentLoaded")//, showFirmware)

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered"))
    })
}


