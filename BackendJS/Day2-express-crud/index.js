const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require('fs')

const app = express();
const PORT = 8000;

//middleware
app.use(express.urlencoded({extended: false}));

//Routes

// GET
app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

    res.send(html)
})

app
    .route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    return res.json(user);
    })
    // .post((req, res) => {
    // //Create new user
    // return res.json({ status: "pending"});
    // })
    .patch((req, res) => {
    //patch user data

    const id = Number(req.params.id);
    
    const {first_name} = req.body;

    const user = users.findIndex((user) => user.id === id);

    users[user].first_name = first_name;

        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({ status: "Success", user: users[user]});
        })
    
    })
    .delete((req, res) => {
    //Delete user with id
    return res.json({ status: "pending"});
});

// app.get('/api/users/:id', (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find((user) => user.id === id);

//     return res.json(user);
// })

//POST

app.post('/api/users', (req, res) => {
    //Create new user
    const body = req.body;
    console.log("Body", body);
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "Success", id: users.length});
    });
    
});

// //PATCH
// app.patch('/api/users/:id', (req, res) => {
//     //patch user data
//     return res.json({ status: "pending"});
// });

// //DELETE
// app.delete('/api/users/:id', (req, res) => {
//     //Delete user with id
//     return res.json({ status: "pending"});
// });

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))