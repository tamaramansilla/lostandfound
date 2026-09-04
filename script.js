```javascript
/* =========================================================
   SANTA CRUZ PET WATCH
   No Firebase or Supabase required.

   Reports are saved using localStorage.
========================================================= */


/* =========================================================
   STARTING PET REPORTS
========================================================= */

const starterPets = [

    {
        id: "lf001",
        status: "Lost",
        name: "Rumba",
        species: "Dog",
        breed: "Dachshund",
        area: "Urubo",
        date: "2026-08-08",
        image: "https://placedog.net/600/600?id=12",
        contact: "777-12345",
        description:
            "Female dachshund, very friendly but might be scared. Wearing a red collar."
    },

    {
        id: "lf002",
        status: "Found",
        name: "Unknown",
        species: "Cat",
        breed: "Domestic Shorthair",
        area: "Equipetrol",
        date: "2026-08-09",
        image: "https://cataas.com/cat?width=600&height=600",
        contact: "777-98765",
        description:
            "Found hiding under a car near the Ventura Mall. Very vocal, no collar."
    },

    {
        id: "lf003",
        status: "Lost",
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        area: "Sirari",
        date: "2026-08-05",
        image: "https://placedog.net/600/600?id=43",
        contact: "777-55555",
        description:
            "Large male Golden Retriever. Microchipped. Wandered off during the storm."
    }

];


/* =========================================================
   GET SAVED PETS
========================================================= */

function getSavedPets() {

    const saved =
        localStorage.getItem("santaCruzPetReports");


    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Could not read saved pets.",
                error
            );

        }

    }


    /*
        If this is the first time opening
        the website, use the starter pets.
    */

    localStorage.setItem(
        "santaCruzPetReports",
        JSON.stringify(starterPets)
    );


    return starterPets;
}


let pets = getSavedPets();


/* =========================================================
   SAVE PETS
========================================================= */

function savePets() {

    localStorage.setItem(
        "santaCruzPetReports",
        JSON.stringify(pets)
    );

}


/* =========================================================
   ELEMENTS
========================================================= */

const petFeed =
    document.getElementById("petFeed");


const statusFilter =
    document.getElementById("statusFilter");


const areaFilter =
    document.getElementById("areaFilter");


const areaButtons =
    document.querySelectorAll(".area-button");


const reportForm =
    document.getElementById("reportForm");


/* =========================================================
   DISPLAY PETS
========================================================= */

function displayPets(petList) {

    petFeed.innerHTML = "";


    if (petList.length === 0) {

        petFeed.innerHTML = `
            <div class="no-results">
                <p>🐾 No pet reports found.</p>
                <p>Try changing your filters.</p>
            </div>
        `;

        return;
    }


    petList.forEach(function(pet) {

        const card =
            document.createElement("article");


        card.className =
            "pet-card";


        /*
            Create the buttons depending
            on the current status.
        */

        let statusControls = "";


        if (pet.status === "Lost") {

            statusControls = `

                <div class="status-controls">

                    <p class="status-controls-title">
                        Update this report:
                    </p>

                    <button
                        class="found-button"
                        onclick="changeStatus('${pet.id}', 'Found')"
                    >
                        🟢 Mark as Found
                    </button>

                    <button
                        class="reunited-button"
                        onclick="changeStatus('${pet.id}', 'Reunited')"
                    >
                        ❤️ Reunited
                    </button>

                    <button
                        class="delete-button"
                        onclick="deletePet('${pet.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;

        }


        else if (pet.status === "Found") {

            statusControls = `

                <div class="status-controls">

                    <p class="status-controls-title">
                        Update this report:
                    </p>

                    <button
                        class="lost-button"
                        onclick="changeStatus('${pet.id}', 'Lost')"
                    >
                        🔴 Mark as Lost
                    </button>

                    <button
                        class="reunited-button"
                        onclick="changeStatus('${pet.id}', 'Reunited')"
                    >
                        ❤️ Reunited
                    </button>

                    <button
                        class="delete-button"
                        onclick="deletePet('${pet.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;

        }


        else {

            statusControls = `

                <div class="status-controls">

                    <p class="status-controls-title">
                        This pet has been reunited ❤️
                    </p>

                    <button
                        class="lost-button"
                        onclick="changeStatus('${pet.id}', 'Lost')"
                    >
                        🔴 Mark as Lost
                    </button>

                    <button
                        class="delete-button"
                        onclick="deletePet('${pet.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;

        }


        /*
            Create card.
        */

        card.innerHTML = `

            <img
                src="${escapeHTML(pet.image)}"
                alt="Photo of ${escapeHTML(pet.name)}"
                onerror="imageError(this)"
            >


            <div class="pet-info">


                <span class="status ${pet.status.toLowerCase()}">
                    ${escapeHTML(pet.status)}
                </span>


                <h3>
                    ${escapeHTML(pet.name)}
                </h3>


                <p class="pet-details">
                    ${escapeHTML(pet.species)}
                    •
                    ${escapeHTML(pet.breed)}
                </p>


                <p class="area">
                    📍 ${escapeHTML(pet.area)}
                </p>


                <p class="description">
                    ${escapeHTML(pet.description)}
                </p>


                <p class="contact">
                    📞 ${escapeHTML(pet.contact)}
                </p>


                <small>
                    Reported: ${escapeHTML(pet.date)}
                </small>


                ${statusControls}


            </div>

        `;


        petFeed.appendChild(card);

    });

}


/* =========================================================
   IMAGE ERROR
========================================================= */

function imageError(image) {

    /*
        If an image URL doesn't work,
        show a clean placeholder instead
        of leaving a broken image.
    */

    image.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="600"
                height="600"
                viewBox="0 0 600 600"
            >

                <rect
                    width="600"
                    height="600"
                    fill="#ffe5ec"
                />

                <text
                    x="300"
                    y="275"
                    text-anchor="middle"
                    font-size="90"
                >
                    🐾
                </text>

                <text
                    x="300"
                    y="370"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="25"
                    fill="#a4133c"
                >
                    Pet photo unavailable
                </text>

            </svg>

        `);

}


/* =========================================================
   FILTER PETS
========================================================= */

function filterPets() {

    const selectedStatus =
        statusFilter.value;


    const selectedArea =
        areaFilter.value;


    const filteredPets =
        pets.filter(function(pet) {


            const statusMatches =
                selectedStatus === "All" ||
                pet.status === selectedStatus;


            const areaMatches =
                selectedArea === "All" ||
                pet.area === selectedArea;


            return (
                statusMatches &&
                areaMatches
            );

        });


    displayPets(filteredPets);

}


/* =========================================================
   STATUS FILTER
========================================================= */

statusFilter.addEventListener(
    "change",
    function() {

        filterPets();

    }
);


/* =========================================================
   AREA FILTER
========================================================= */

areaFilter.addEventListener(
    "change",
    function() {

        const selectedArea =
            areaFilter.value;


        areaButtons.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        const matchingButton =
            document.querySelector(
                `[data-area="${selectedArea}"]`
            );


        if (matchingButton) {

            matchingButton.classList.add(
                "active"
            );

        }


        filterPets();

    }
);


/* =========================================================
   AREA BUTTONS
========================================================= */

areaButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {


                areaButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const selectedArea =
                    button.dataset.area;


                areaFilter.value =
                    selectedArea;


                filterPets();

            }
        );

    }
);


/* =========================================================
   REPORT FORM
========================================================= */

reportForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /*
            Browser automatically checks
            required fields and URL format.
        */

        if (!reportForm.checkValidity()) {

            reportForm.reportValidity();

            return;

        }


        /* Get information */

        const status =
            document.getElementById(
                "reportStatus"
            ).value;


        const name =
            document.getElementById(
                "petName"
            ).value.trim();


        const species =
            document.getElementById(
                "species"
            ).value;


        const breed =
            document.getElementById(
                "breed"
            ).value.trim();


        const image =
            document.getElementById(
                "imageURL"
            ).value.trim();


        const area =
            document.getElementById(
                "reportArea"
            ).value;


        const contact =
            document.getElementById(
                "contact"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        /*
            Create a unique ID.
        */

        const newPet = {

            id:
                "pet-" +
                Date.now() +
                "-" +
                Math.floor(
                    Math.random() * 10000
                ),

            status:
                status,

            name:
                name,

            species:
                species,

            breed:
                breed,

            area:
                area,

            date:
                getToday(),

            image:
                image,

            contact:
                contact,

            description:
                description

        };


        /*
            Add the new pet
            to the beginning of the feed.
        */

        pets.unshift(newPet);


        /*
            Save permanently in this browser.
        */

        savePets();


        /*
            Refresh feed immediately.
        */

        filterPets();


        /*
            Reset form.
        */

        reportForm.reset();


        /*
            Show confirmation.
        */

        alert(
            "🐾 Pet report successfully posted!"
        );


        /*
            Scroll to the new feed.
        */

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   CHANGE STATUS
========================================================= */

function changeStatus(
    petId,
    newStatus
) {

    const pet =
        pets.find(
            function(item) {

                return item.id === petId;

            }
        );


    if (!pet) {

        return;

    }


    pet.status =
        newStatus;


    savePets();


    filterPets();


    alert(
        "Pet status changed to " +
        newStatus +
        " 🐾"
    );

}


/* =========================================================
   DELETE PET
========================================================= */

function deletePet(petId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this report?"
        );


    if (!confirmed) {

        return;

    }


    pets =
        pets.filter(
            function(pet) {

                return pet.id !== petId;

            }
        );


    savePets();


    filterPets();

}


/* =========================================================
   TODAY'S DATE
========================================================= */

function getToday() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   START WEBSITE
========================================================= */

displayPets(pets);
```
