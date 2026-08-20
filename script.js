/* =========================================
   IMAGE CONFIGURATION

   Image paths and alt text live in
   assets/images.json so they can be changed
   without editing the page markup.
========================================= */

async function loadConfiguredImages() {

  try {

    const response = await fetch("assets/images.json");

    if (!response.ok) {
      throw new Error(`Image config request failed: ${response.status}`);
    }

    const imageConfig = await response.json();

    document.querySelectorAll("[data-image]").forEach(slot => {

      const image = imageConfig[slot.dataset.image];

      if (!image || !image.src) {
        return;
      }

      slot.style.backgroundImage = `url("${encodeURI(image.src)}")`;
      slot.classList.add("is-image");
      slot.setAttribute("role", "img");
      slot.setAttribute("aria-label", image.alt || "");

    });

  } catch (error) {
    console.error("Unable to load image configuration.", error);
  }

}


loadConfiguredImages();


/* =========================================
   SAMPLE EVENT DATA

   FUTURE:
   Replace this static data with events
   returned by Supabase or another API.
========================================= */

const events = [
  {
    id: 1,
    title: "Rooftop Party in Brooklyn",
    borough: "brooklyn",
    neighborhood: "Williamsburg",
    category: "nightlife",
    date: "2026-08-22",
    price: 20
  },
  {
    id: 2,
    title: "Queens Night Market",
    borough: "queens",
    neighborhood: "Flushing",
    category: "food",
    date: "2026-08-23",
    price: 0
  },
  {
    id: 3,
    title: "Late Night Comedy",
    borough: "manhattan",
    neighborhood: "Greenwich Village",
    category: "comedy",
    date: "2026-08-24",
    price: 15
  },
  {
    id: 4,
    title: "Outdoor Movie Night",
    borough: "manhattan",
    neighborhood: "Midtown",
    category: "outdoors",
    date: "2026-08-25",
    price: 0
  },
  {
    id: 5,
    title: "Live on the Lower East Side",
    borough: "manhattan",
    neighborhood: "Lower East Side",
    category: "music",
    date: "2026-08-26",
    price: 18
  },
  {
    id: 6,
    title: "Bushwick Art Pop-Up",
    borough: "brooklyn",
    neighborhood: "Bushwick",
    category: "art",
    date: "2026-08-27",
    price: 10
  }
];


/* =========================================
   AUTHENTICATION STATE

   FUTURE:
   Replace with Supabase Auth.

   Example:

   supabase.auth.getSession()

========================================= */

let isLoggedIn = false;

const signInButton = document.getElementById("signInButton");
const logoutButton = document.getElementById("logoutButton");
const profileButton = document.getElementById("profileButton");
const footerSignIn = document.getElementById("footerSignIn");


function updateAuthUI() {

  if (isLoggedIn) {

    signInButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");
    profileButton.classList.remove("hidden");

    footerSignIn.textContent = "Profile";

  } else {

    signInButton.classList.remove("hidden");
    logoutButton.classList.add("hidden");
    profileButton.classList.add("hidden");

    footerSignIn.textContent = "Sign In";

  }

}


function fakeSignIn() {

  isLoggedIn = true;

  updateAuthUI();

  console.log("Signed in.");

}


function fakeLogout() {

  isLoggedIn = false;

  updateAuthUI();

  console.log("Logged out.");

}


signInButton.addEventListener("click", fakeSignIn);

logoutButton.addEventListener("click", fakeLogout);

footerSignIn.addEventListener("click", () => {

  if (!isLoggedIn) {
    fakeSignIn();
  } else {
    console.log("Open profile page.");
  }

});


updateAuthUI();


/* =========================================
   MOBILE NAVIGATION
========================================= */

const mobileMenuToggle =
  document.getElementById("mobileMenuToggle");

const mainNav =
  document.getElementById("mainNav");


mobileMenuToggle.addEventListener("click", () => {

  const isOpen =
    mainNav.classList.toggle("open");

  mobileMenuToggle.setAttribute(
    "aria-expanded",
    isOpen
  );

  mobileMenuToggle.textContent =
    isOpen ? "✕" : "☰";

});


/* Close mobile menu when a navigation link
   is selected.
*/

mainNav.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");

    mobileMenuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    mobileMenuToggle.textContent = "☰";

  });

});


/* =========================================
   SEARCH FORM
========================================= */

const eventSearchForm =
  document.getElementById("eventSearchForm");

const eventSearch =
  document.getElementById("eventSearch");

const boroughFilter =
  document.getElementById("boroughFilter");

const categoryFilter =
  document.getElementById("categoryFilter");

const dateFilter =
  document.getElementById("dateFilter");


eventSearchForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const query =
      eventSearch.value
        .trim()
        .toLowerCase();

    const borough =
      boroughFilter.value;

    const category =
      categoryFilter.value;

    const results =
      events.filter(eventItem => {

        const matchesQuery =
          !query ||
          eventItem.title
            .toLowerCase()
            .includes(query) ||
          eventItem.neighborhood
            .toLowerCase()
            .includes(query);

        const matchesBorough =
          !borough ||
          eventItem.borough === borough;

        const matchesCategory =
          !category ||
          eventItem.category === category;

        return (
          matchesQuery &&
          matchesBorough &&
          matchesCategory
        );

      });

    console.log(
      "Search results:",
      results
    );

    filterVisibleEventCards(
      borough,
      category,
      query
    );

  }
);


/* =========================================
   EVENT CARD FILTERING
========================================= */

function filterVisibleEventCards(
  borough = "",
  category = "",
  query = ""
) {

  const cards =
    document.querySelectorAll(".event-card");

  cards.forEach(card => {

    const cardBorough =
      card.dataset.borough;

    const cardCategory =
      card.dataset.category;

    const cardText =
      card.textContent.toLowerCase();

    const boroughMatch =
      !borough ||
      cardBorough === borough;

    const categoryMatch =
      !category ||
      cardCategory === category;

    const queryMatch =
      !query ||
      cardText.includes(query);

    const shouldShow =
      boroughMatch &&
      categoryMatch &&
      queryMatch;

    card.style.display =
      shouldShow ? "" : "none";

  });

}


/* =========================================
   CATEGORY BUTTONS
========================================= */

const categoryButtons =
  document.querySelectorAll(
    ".category-card"
  );


categoryButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const category =
        button.dataset.category;

      categoryFilter.value =
        category;

      filterVisibleEventCards(
        "",
        category,
        ""
      );

      document
        .getElementById("featured")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


/* =========================================
   BOROUGH BUTTONS
========================================= */

const boroughButtons =
  document.querySelectorAll(
    ".borough-card"
  );


boroughButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const borough =
        button.dataset.borough;

      boroughFilter.value =
        borough;

      filterVisibleEventCards(
        borough,
        "",
        ""
      );

      document
        .getElementById("featured")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


/* =========================================
   QUICK FILTERS
========================================= */

const quickFilters =
  document.querySelectorAll(
    ".quick-filter"
  );


quickFilters.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      quickFilters.forEach(item =>
        item.classList.remove("active")
      );

      button.classList.add("active");

      const filter =
        button.dataset.filter;

      console.log(
        "Quick filter selected:",
        filter
      );

      /*
        FUTURE:

        This is where date logic will
        filter real event data.

        Examples:

        Today
        Tonight
        Tomorrow
        Weekend
        Free
        Under $25
      */

      if (filter === "free") {

        filterCardsByPrice(
          price => price === 0
        );

      }

      if (filter === "under25") {

        filterCardsByPrice(
          price => price <= 25
        );

      }

    }
  );

});


function filterCardsByPrice(
  priceCondition
) {

  const cards =
    document.querySelectorAll(
      ".event-card"
    );

  cards.forEach((card, index) => {

    const eventItem =
      events[index];

    if (!eventItem) {
      return;
    }

    card.style.display =
      priceCondition(eventItem.price)
        ? ""
        : "none";

  });

}


/* =========================================
   SAVE / BOOKMARK EVENTS
========================================= */

const saveButtons =
  document.querySelectorAll(
    ".save-button"
  );


saveButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const saved =
        button.classList.toggle(
          "saved"
        );

      button.textContent =
        saved ? "♥" : "♡";

      button.setAttribute(
        "aria-pressed",
        saved
      );

      /*
        FUTURE:

        If user is logged in:

        Save event ID to
        Supabase user_saves table.

        Example structure:

        user_id
        event_id
        created_at
      */

    }
  );

});


/* =========================================
   WEEKEND CAROUSEL
========================================= */

const weekendCarousel =
  document.getElementById(
    "weekendCarousel"
  );

const weekendPrevious =
  document.getElementById(
    "weekendPrevious"
  );

const weekendNext =
  document.getElementById(
    "weekendNext"
  );


weekendNext.addEventListener(
  "click",
  () => {

    weekendCarousel.scrollBy({
      left: 310,
      behavior: "smooth"
    });

  }
);


weekendPrevious.addEventListener(
  "click",
  () => {

    weekendCarousel.scrollBy({
      left: -310,
      behavior: "smooth"
    });

  }
);


/* =========================================
   LOAD MORE EVENT FEED
========================================= */

const loadMoreButton =
  document.getElementById(
    "loadMoreButton"
  );

const additionalEvents =
  document.querySelectorAll(
    ".feed-extra"
  );


loadMoreButton.addEventListener(
  "click",
  () => {

    additionalEvents.forEach(
      event => {
        event.classList.remove(
          "hidden"
        );
      }
    );

    loadMoreButton.textContent =
      "That's everything for now.";

    loadMoreButton.disabled =
      true;

  }
);


/* =========================================
   NEWSLETTER
========================================= */

const newsletterForm =
  document.getElementById(
    "newsletterForm"
  );

const newsletterEmail =
  document.getElementById(
    "newsletterEmail"
  );

const newsletterMessage =
  document.getElementById(
    "newsletterMessage"
  );


newsletterForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const email =
      newsletterEmail.value.trim();

    if (!email) {
      return;
    }

    /*
      FUTURE:

      Send email to Supabase,
      Mailchimp, ConvertKit,
      Resend or another
      newsletter provider.
    */

    console.log(
      "Newsletter signup:",
      email
    );

    newsletterMessage.textContent =
      "You're on the list.";

    newsletterForm.reset();

  }
);


/* =========================================
   SEARCH NAV BUTTON

   Scroll to hero search.
========================================= */

const searchNavButton =
  document.querySelector(
    ".search-nav-button"
  );


searchNavButton.addEventListener(
  "click",
  () => {

    eventSearch.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    setTimeout(
      () => eventSearch.focus(),
      500
    );

  }
);


/* =========================================
   DEVELOPMENT INFO
========================================= */

console.log(
  `${events.length} sample events loaded.`
);

console.log(
  "NYC Events scaffold ready."
);