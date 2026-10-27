document.addEventListener("DOMContentLoaded", () => {
    // 1. Select DOM elements
    const form = document.querySelector("#regform");
    const inputs = form.querySelectorAll("input, select, textarea");
    const successMsg = document.querySelector("#successMsg");
    const memberList = document.querySelector("#memberList");
    const count = document.querySelector("#count");
    const themeBtn = document.querySelector("#theme");

    console.log("Form:", form);
    console.log("Input fields:", inputs);
    console.log("Success message:", successMsg);
    console.log("Member list:", memberList);
    console.log("Member counter:", count);
    console.log("Dark Mode button:", themeBtn);

    inputs.forEach(input => {
        console.log(
            input.id,
            document.querySelector(`#${input.id}Error`)
        );
    });

    let members = [];

    // 2. Validate each field
    function validateField(input) {
        const error = document.querySelector(`#${input.id === "confirm-password" ? "confirm" : input.id}Error`);
        const value = input.value.trim();
        let message = "";

        if (!value) {
            message = "This field is required.";
        } else {
            switch (input.id) {
                case "name":
                    if (value.length < 2) message = "Name must have at least 2 characters.";
                    break;

                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        message = "Enter a valid email address.";
                    }
                    break;

                case "password":
                    if (input.value.length < 8) {
                        message = "Password must be at least 8 characters.";
                    }
                    break;

                case "confirm-password":
                    if (input.value !== document.querySelector("#password").value) {
                        message = "Passwords do not match.";
                    }
                    break;

                case "gender":
                    if (!value) message = "Please select your gender.";
                    break;

                case "dob":
                    if (new Date(value) > new Date()) {
                        message = "Date of birth cannot be in the future.";
                    }
                    break;

                case "country":
                    if (value.length < 2) message = "Enter a valid country.";
                    break;

                case "phone":
                    if (!/^\+?[0-9\s()-]{7,20}$/.test(value)) {
                        message = "Enter a valid phone number.";
                    }
                    break;

                case "bio":
                    if (value.length < 10) {
                        message = "Bio must have at least 10 characters.";
                    }
                    break;
            }
        }

        error.textContent = message;
        return message === "";
    }

    // 3. Clear errors as the user fixes them
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            validateField(input);
            successMsg.classList.add("hidden");
        });

        input.addEventListener("change", () => {
            validateField(input);
        });
    });

    // 4. Update member counter
    function updateCount() {
        count.textContent = members.length;
    }

    // 5. Register and display members
    function displayMembers() {
        memberList.innerHTML = "";

        if (members.length === 0) {
            const empty = document.createElement("li");
            empty.className = "empty";
            empty.textContent = "No members yet. Register someone to begin.";
            memberList.appendChild(empty);
        }

        members.forEach((member, index) => {
            const li = document.createElement("li");
            li.className = "member-item";

            const details = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = member.name;

            const email = document.createElement("p");
            email.textContent = member.email;

            const country = document.createElement("p");
            country.textContent = member.country;

            details.append(name, email, country);

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "Remove";

            removeBtn.addEventListener("click", () => {
                members.splice(index, 1);
                displayMembers();
                updateCount();
            });

            li.append(details, removeBtn);
            memberList.appendChild(li);
        });

        updateCount();
    }

    // 6. Capture form submission
    form.addEventListener("submit", event => {
        event.preventDefault();

        let valid = true;

        inputs.forEach(input => {
            if (!validateField(input)) valid = false;
        });

        if (!valid) return;

        const email = document.querySelector("#email").value.trim();

        if (members.some(member => member.email.toLowerCase() === email.toLowerCase())) {
            document.querySelector("#emailError").textContent =
                "This email is already registered.";
            return;
        }

        const member = {
            name: document.querySelector("#name").value.trim(),
            email: email,
            country: document.querySelector("#country").value.trim()
        };

        members.push(member);

        displayMembers();

        // 7. Show success message and reset form
        successMsg.textContent = `Registration successful! Welcome, ${member.name}.`;
        successMsg.classList.remove("hidden");

        form.reset();

        inputs.forEach(input => {
            const errorId = input.id === "confirm-password"
                ? "confirm"
                : input.id;

            document.querySelector(`#${errorId}Error`).textContent = "";
        });
    });

    // 8. Dark Mode toggle
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const darkMode = document.body.classList.contains("dark-mode");
        themeBtn.textContent = darkMode ? "Light Mode" : "Dark Mode";
    });

    // 9. Initialize the member list and counter
    displayMembers();
});