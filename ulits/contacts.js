const fs = require('fs')

dirPath = './data'
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

// get all user
const dataPath = './data/contacts.json'
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = ()=>{
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts =JSON.parse(fileBuffer)
    return contacts
}

const findContact = (nama)=>{
    const contacts = loadContact()
    const contact = contacts.find((contact)=> contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

// menuliskan / meimpa fil contacts.json dengan data yang baru
const saveContacts = (contacts)=>{
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}




// menambahkan dat contact baru
const addContact=(contact)=>{
    const contacts =loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// cek nama duplikat
const cekDuplikat =(nama)=>{
    const contacts = loadContact();
    return contacts.find((contact)=> contact.nama === nama)
}



module.exports={loadContact, findContact, addContact, cekDuplikat}