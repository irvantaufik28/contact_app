const express = require("express");
const epxressLayouts = require("express-ejs-layouts");
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./ulits/contacts");
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// thirdt-party middleware
app.use(epxressLayouts);

// builtin mildeware
// parsing data post
app.use(express.urlencoded({ extended: true }))

// express public 
app.use(express.static("public"));

// konfigurasi flassh
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())







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
    msg: req.flash('msg')

  });
});

// halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout'
  })
})

// prosse data contact

app.post('/contact', [
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);
    if (duplikat) {
      throw new Error('nama Contact sudah digunakan');
    }
    return true;
  }),
  check('email', 'format email salah').isEmail(),
  check('nohp', 'format no hp salah').isMobilePhone('id-ID')],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // return res.status(400).json({errors: errors.array()})
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array()
      })
    } else {
      addContact(req.body)
      // kirimkan  flash
      req.flash('msg', "Data Contact Berhasil ditambahkan")
      res.redirect('/contact')
    }
  })

// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama)
  if (!contact) {
    res.status(404);
    res.send('404')
  } else {
    deleteContact(req.params.nama)
    req.flash('msg', "Data Contact Berhasil dihapus")
    res.redirect('/contact')
  }

})

// form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama)
  res.render('edit-contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/main-layout',
    contact,
  })
})






// prosse ubah data



app.post('/contact/update', [
  body('nama').custom((value, {req}) => {
    const duplikat = cekDuplikat(value);
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('nama Contact sudah digunakan');
    }
    return true;
  }),
  check('email', 'format email salah').isEmail(),
  check('nohp', 'format no hp salah').isMobilePhone('id-ID')],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // return res.status(400).json({errors: errors.array()})
      res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      })
    } else {
      updateContacts(req.body)
        req.flash('msg', "Data Contact Berhasil diUbah")
      res.redirect('/contact')
    }
  })







// halaman detail contac
app.get("/contact/:nama", (req, res) => {
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
