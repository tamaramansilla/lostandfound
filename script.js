```javascript
/* =====================================================
   SUPABASE CONNECTION
===================================================== */

/*
    IMPORTANT:

    Replace these two values with your Supabase project
    URL and your PUBLIC anon key.

    DO NOT put your Supabase service_role key here.
*/

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =====================================================
   ELEMENTS
===================================================== */

const petFeed = document.getElementById("petFeed");
const statusFilter = document.getElementById("statusFilter");
const areaFilter = document.getElementById("areaFilter");
const areaButtons = document.querySelectorAll(".area-button");

const reportForm = document.getElementById("reportForm");
const loginMessage = document.getElementById("loginMessage");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userStatus = document.getElementById("userStatus");

const accountModal = document.getElementById("accountModal");
const closeModal = document.getElementById("closeModal");

const accountForm = document.getElementById("accountForm");
const accountTitle = document.getElementById("accountTitle");

const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountPassword = document.getElementById("accountPassword");

const nameField = document.getElementById("nameField");

const accountSwitchText =
    document.getElementById("accountSwitchText");

const switchAccountMode =
    document.getElementById("switchAccountMode");

const accountMessage =
    document.getElementById("accountMessage");

const loadingMessage =
    document.getElementById("loadingMessage");


/* =====================================================
   VARIABLES
===================================================== */

let currentUser = null;
let isLoginMode = false;
let pets = [];


/* =====================================================
   LOAD PETS
===================================================== */

async function loadPets() {

    loadingMessage.style.display = "block";

    const { data, error } = await supabaseClient
        .from("pets")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    loadingMessage.style.display = "none";


    if (error) {

        console.error(error);

        petFeed.innerHTML =
            "<p>Unable to load pet reports.</p>";

        return;
    }


    pets = data || [];

    filterPets();
}


/* =====================================================
   DISPLAY PETS
===================================================== */

function displayPets(petList) {

    petFeed.innerHTML = "";


    if (petList.length === 0) {

        petFeed.innerHTML =
            "<p>No pet reports found.</p>";

        return;
    }


    petList.forEach(function(pet) {

        const card =
            document.createElement("article");

        card.className = "pet-card";


        let statusButtons = "";


        /*
            Only the person who created the post
            gets the status controls.
        */

        if (
            currentUser &&
            pet.user_id === currentUser.id
        ) {

            statusButtons = `

                <div class="status-controls">

                    <p>Update this pet's status:</p>

                    ${
                        pet.status !== "Found"
                        ? `
                        <button
                            class="found-button"
                            onclick="changeStatus('${pet.id}', 'Found')"
                        >
                            🟢 Mark Found
                        </button>
                        `
                        : ""
                    }

                    ${
                        pet.status !== "Reunited"
                        ? `
                        <button
                            class="reunited-button"
                            onclick="changeStatus('${pet.id}', 'Reunited')"
                        >
                            ❤️ Reunited
                        </button>
                        `
                        : ""
                    }

                    <button
                        class="delete-button"
                        onclick="deletePet('${pet.id}')"
                    >
                        Delete Post
                    </button>

                </div>
            `;
        }


        card.innerHTML = `

            <img
                src="${escapeHTML(pet.image)}"
                alt="Photo of ${escapeHTML(pet.name)}"
                onerror="this.src='https://placedog.net/500/500?id=1'"
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
                    Reported:
                    ${formatDate(pet.created_at)}
                </small>


                ${statusButtons}

            </div>
        `;


        petFeed.appendChild(card);

    });
}


/* =====================================================
   FILTER PETS
===================================================== */

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


            return statusMatches && areaMatches;

        });


    displayPets(filteredPets);
}


/* =====================================================
   FILTER EVENTS
===================================================== */

statusFilter.addEventListener(
    "change",
    filterPets
);


areaFilter.addEventListener(
    "change",
    function() {

        areaButtons.forEach(
            function(button) {

                button.classList.remove("active");

            }
        );


        const selectedArea =
            areaFilter.value;


        areaButtons.forEach(
            function(button) {

                if (
                    button.dataset.area ===
                    selectedArea
                ) {

                    button.classList.add("active");

                }

            }
        );


        filterPets();

    }
);


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


                button.classList.add("active");


                const selectedArea =
                    button.dataset.area;


                areaFilter.value =
                    selectedArea;


                filterPets();

            }
        );

    }
);


/* =====================================================
   ACCOUNT MODAL
===================================================== */

loginButton.addEventListener(
    "click",
    function() {

        isLoginMode = false;

        updateAccountModal();

        accountModal.classList.remove(
            "hidden"
        );

    }
);


closeModal.addEventListener(
    "click",
    function() {

        accountModal.classList.add(
            "hidden"
        );

    }
);


accountModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            accountModal
        ) {

            accountModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =====================================================
   SWITCH LOGIN / SIGNUP
===================================================== */

switchAccountMode.addEventListener(
    "click",
    function() {

        isLoginMode =
            !isLoginMode;

        updateAccountModal();

    }
);


function updateAccountModal() {

    accountMessage.textContent = "";

    accountForm.reset();


    if (isLoginMode) {

        accountTitle.textContent =
            "Welcome Back 🐾";

        nameField.classList.add(
            "hidden"
        );

        accountSwitchText.textContent =
            "Don't have an account?";

        switchAccountMode.textContent =
            "Create Account";

        accountForm.querySelector(
            "button[type='submit']"
        ).textContent =
            "Log In";

    } else {

        accountTitle.textContent =
            "Create Account 🐾";

        nameField.classList.remove(
            "hidden"
        );

        accountSwitchText.textContent =
            "Already have an account?";

        switchAccountMode.textContent =
            "Log In";

        accountForm.querySelector(
            "button[type='submit']"
        ).textContent =
            "Create Account";

    }
}


/* =====================================================
   CREATE ACCOUNT / LOGIN
===================================================== */

accountForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            accountEmail.value.trim();

        const password =
            accountPassword.value;


        accountMessage.textContent =
            "Please wait...";


        /* LOGIN */

        if (isLoginMode) {

            const { error } =
                await supabaseClient.auth.signInWithPassword(
                    {
                        email: email,
                        password: password
                    }
                );


            if (error) {

                accountMessage.textContent =
                    error.message;

                return;
            }


            accountMessage.textContent =
                "Logged in successfully!";


            setTimeout(
                function() {

                    accountModal.classList.add(
                        "hidden"
                    );

                },
                800
            );


            return;
        }


        /* CREATE ACCOUNT */

        const name =
            accountName.value.trim();


        const { data, error } =
            await supabaseClient.auth.signUp(
                {
                    email: email,
                    password: password,

                    options: {

                        data: {
                            name: name
                        }

                    }
                }
            );


        if (error) {

            accountMessage.textContent =
                error.message;

            return;
        }


        accountMessage.textContent =
            "Account created! Check your email to confirm your account.";

    }
);


/* =====================================================
   LOG OUT
===================================================== */

logoutButton.addEventListener(
    "click",
    async function() {

        await supabaseClient.auth.signOut();

    }
);


/* =====================================================
   AUTH STATE
===================================================== */

supabaseClient.auth.onAuthStateChange(
    function(event, session) {

        currentUser =
            session
            ? session.user
            : null;


        updateUserInterface();

        displayPets(
            pets.filter(function(pet) {

                return (
                    statusFilter.value === "All" ||
                    pet.status === statusFilter.value
                ) &&
                (
                    areaFilter.value === "All" ||
                    pet.area === areaFilter.value
                );

            })
        );

    }
);


/* =====================================================
   UPDATE USER UI
===================================================== */

function updateUserInterface() {

    if (currentUser) {

        const name =
            currentUser.user_metadata?.name;


        userStatus.textContent =
            name
            ? `Hello, ${name} 🐾`
            : "Logged in 🐾";


        loginButton.classList.add(
            "hidden"
        );


        logoutButton.classList.remove(
            "hidden"
        );


        reportForm.classList.remove(
            "hidden"
        );


        loginMessage.classList.add(
            "hidden"
        );

    } else {

        userStatus.textContent =
            "Not logged in";


        loginButton.classList.remove(
            "hidden"
        );


        logoutButton.classList.add(
            "hidden"
        );


        reportForm.classList.add(
            "hidden"
        );


        loginMessage.classList.remove(
            "hidden"
        );

    }
}


/* =====================================================
   REPORT A PET
===================================================== */

reportForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!currentUser) {

            alert(
                "You need to log in before reporting a pet."
            );

            return;
        }


        const reportButton =
            reportForm.querySelector(
                "button[type='submit']"
            );


        reportButton.disabled = true;

        reportButton.textContent =
            "Saving report...";


        const newPet = {

            user_id:
                currentUser.id,

            status:
                document.getElementById(
                    "reportStatus"
                ).value,

            name:
                document.getElementById(
                    "petName"
                ).value.trim(),

            species:
                document.getElementById(
                    "species"
                ).value,

            breed:
                document.getElementById(
                    "breed"
                ).value.trim(),

            image:
                document.getElementById(
                    "imageURL"
                ).value.trim(),

            area:
                document.getElementById(
                    "reportArea"
                ).value,

            contact:
                document.getElementById(
                    "contact"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim()

        };


        const { error } =
            await supabaseClient
                .from("pets")
                .insert(newPet);


        if (error) {

            console.error(error);

            alert(
                "There was a problem saving the report: " +
                error.message
            );

            reportButton.disabled = false;

            reportButton.textContent =
                "🐾 Report Pet";

            return;
        }


        alert(
            "Pet report successfully posted! 🐾"
        );


        reportForm.reset();


        reportButton.disabled = false;

        reportButton.textContent =
            "🐾 Report Pet";


        await loadPets();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =====================================================
   CHANGE PET STATUS
===================================================== */

async function changeStatus(
    petId,
    newStatus
) {

    if (!currentUser) {

        alert(
            "You must be logged in."
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("pets")
            .update({
                status: newStatus
            })
            .eq("id", petId)
            .eq(
                "user_id",
                currentUser.id
            );


    if (error) {

        alert(
            "Unable to change status: " +
            error.message
        );

        return;
    }


    await loadPets();

}


/* =====================================================
   DELETE PET
===================================================== */

async function deletePet(petId) {

    if (!currentUser) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this pet report?"
        );


    if (!confirmed) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("pets")
            .delete()
            .eq("id", petId)
            .eq(
                "user_id",
                currentUser.id
            );


    if (error) {

        alert(
            "Unable to delete the post: " +
            error.message
        );

        return;
    }


    await loadPets();

}


/* =====================================================
   SECURITY HELPER
===================================================== */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {

    if (!date) {
        return "";
    }


    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

}


/* =====================================================
   START APP
===================================================== */

async function startApp() {

    updateUserInterface();

    await loadPets();

}


/* Start */

startApp();
```
