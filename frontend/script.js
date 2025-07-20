// Replace this with your deployed backend URL
const BASE_URL = "https://blood-donor-finder-49dc.onrender.com";

// REGISTER FORM
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const contact = document.getElementById("contact").value;
    const city = document.getElementById("city").value;
    const bloodGroup = document.getElementById("bloodGroup").value;
    const date = document.getElementById("date").value;

    // Simple contact validation
    const isEmail = contact.includes("@");
    const isPhone = /^\d{10}$/.test(contact);
    if (!isEmail && !isPhone) {
      alert("Please enter a valid 10-digit phone number or an email.");
      return;
    }

    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, city, bloodGroup, date }),
    });

    if (response.ok) {
      document.getElementById("ack").classList.remove("hidden");
      registerForm.reset();
    } else {
      alert("Failed to register. Please try again.");
    }
  });
}

// FIND FORM
const findForm = document.getElementById("findForm");
if (findForm) {
  findForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = document.getElementById("city").value;
    const bloodGroup = document.getElementById("bloodGroup").value;

    const response = await fetch(
      `${BASE_URL}/find?city=${encodeURIComponent(city)}&bloodGroup=${encodeURIComponent(bloodGroup)}`
    );
    const donors = await response.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (donors.length === 0) {
      resultsDiv.innerHTML = `<p class="text-red-400 text-center">No donors found.</p>`;
      return;
    }

    donors.forEach((donor) => {
      const donorCard = document.createElement("div");
      donorCard.className = "bg-gray-700 p-4 rounded shadow-md";
      donorCard.innerHTML = `
        <p><strong>Name:</strong> ${donor.name}</p>
        <p><strong>Contact:</strong> ${donor.contact}</p>
        <p><strong>City:</strong> ${donor.city}</p>
        <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
        <p><strong>Last Donated:</strong> ${new Date(donor.date).toDateString()}</p>
      `;
      resultsDiv.appendChild(donorCard);
    });
  });
}
