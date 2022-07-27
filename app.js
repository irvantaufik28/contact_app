const express = require("express");
const epxressLayouts = require("express-ejs-layouts");
const { loadContact, findContact } = require("./ulits/contacts");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// thirdt-party middleware
app.use(epxressLayouts);

// builtin mildeware
app.use(express.static("public"));
// application level midleware

// app.use((req ,res ,next)=>{
//     console.log('Time : ', Date.now())
//     next()
// })

app.get("/", (req, res) => {
  // res.sendFile('./index.html', {root: __dirname})
  const mahasiswa = [
    // {
    //     nama : 'Irvan Taufik',
    //     email : 'irvan@gmail'
    // },
    // {
    //     nama : 'cindy',
    //     email : 'cindy@gmail'
    // },
    // {
    //     nama : 'qian',
    //     email : 'qian@gmail'
    // },
  ];

  res.render("index", {
    nama: "irvan taufik",
    title: "Halaman Home",
    mahasiswa: mahasiswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts: contacts,
  });

});app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail Contact",
    contact: contact,
  });
});



// app.get("/product/:id", (req, res) => {
//   res.send(
//     `Product ID :  ${req.params.id}<br>Category : ${req.query.category}`
//   );
// });

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost ${port}`);
});
