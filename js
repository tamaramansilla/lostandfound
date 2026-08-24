const pets = [
    {
        id: "lf001",
        status: "Lost",
        name: "Rumba",
        species: "Dog",
        breed: "Dachshund",
        area: "Urubo",
        date: "2026-08-08",
        image: "https://placedog.net/500/500?id=12",
        contact: "777-12345",
        description: "Female dachshund, very friendly but might be scared. Wearing a red collar."
    },
    {
        id: "lf002",
        status: "Found",
        name: "Unknown",
        species: "Cat",
        breed: "Domestic Shorthair",
        area: "Equipetrol",
        date: "2026-08-09",
        image: "https://placekitten.com/500/500",
        contact: "777-98765",
        description: "Found hiding under a car near the Ventura Mall. Very vocal, no collar."
    },
    {
        id: "lf003",
        status: "Lost",
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        area: "Sirari",
        date: "2026-08-05",
        image: "https://placedog.net/500/500?id=43",
        contact: "777-55555",
        description: "Large male Golden, microchipped. Wandered off during the storm."
    }
];

const petFeed = document.getElementById("petFeed");
const statusFilter = document.getElementById("statusFilter");
const areaFilter = document.getElementById("areaFilter");
const areaButtons = document.querySelectorAll(".area-button");

function displayPets(petList) {

    petFeed.innerHTML = "";

    if (petList.length === 0) {
        petFeed.innerHTML = "<p>No pet reports found.</p>";
        return;
    }

    petList.forEach(function(pet) {

        const card = document.createElement("article");

        card.className = "pet-card";

        card.innerHTML = `
            <img src="${pet.image}" alt="Photo of ${pet.name}">
            
            <div class="pet-info">

                <span class="status ${pet.status.toLowerCase()}">
                    ${pet.status}
                </span>

                <h3>${pet.name}</h3>

                <p class="pet-details">
                    ${pet.species} • ${pet.breed}
                </p>

                <p class="area">
                    📍 ${pet.area}
                </p>

                <p class="description">
                    ${pet.description}
                </p>

                <p class="contact">
                    📞 ${pet.contact}
                </p>

                <small>
                    Reported: ${pet.date}
                </small>

            </div>
        `;

        petFeed.appendChild(card);
    });
}

function filterPets() {

    const selectedStatus = statusFilter.value;
    const selectedArea = areaFilter.value;

    const filteredPets = pets.filter(function(pet) {

        const statusMatches =
            selectedStatus === "All" ||
            pet.status === selectedStatus;

        const areaMatches =
            selectedArea === "All" ||
            pet.area === selectedArea;

        return statusMatches && areaMatches;
    });

    displayPets(filteredPets);
}

statusFilter.addEventListener("change", filterPets);

areaFilter.addEventListener("change", function() {

    areaButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    const selectedArea = areaFilter.value;

    areaButtons.forEach(function(button) {
        if (button.dataset.area === selectedArea) {
            button.classList.add("active");
        }
    });

    if (selectedArea === "All") {
        document
            .querySelector('[data-area="All"]')
            .classList.add("active");
    }

    filterPets();
});

areaButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        areaButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedArea = button.dataset.area;

        areaFilter.value = selectedArea;

        filterPets();
    });
});

displayPets(pets);

const reportForm = document.getElementById("reportForm");

reportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (reportForm.checkValidity()) {
        alert("Your pet report is ready to be submitted!");
        reportForm.reset();
    }
});
