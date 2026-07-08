const expected = {
  canonicalUrl: "https://www.rsilvafoto.com/",
  emailHref: "mailto:rsilva.photo.au@gmail.com?subject=Photography%20Inquiry",
  instagramUrl: "https://www.instagram.com/rsilva.foto/",
  title: /R\.Silva Photography/i,
};

async function collectConsoleErrors(page) {
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

module.exports = {
  expected,
  collectConsoleErrors,
};
