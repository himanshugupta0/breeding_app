const express = require('express');
const router = express.Router();
const _ = require('lodash');
const async = require('async');
const path = require('path');

const fileUpload = require('../services/fileUpload');
const db = require('../startup/db');
const { result } = require('lodash');


// Create profile
router.post('/new', (req, res) => {
    try {
        let reqBody = req.body;
        db.run('CREATE TABLE IF NOT EXISTS profile(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT, password TEXT, address TEXT, dog_breed TEXT, dog_gender TEXT, dog_age TEXT, dog_pic TEXT)');

        let sql = `INSERT INTO profile(name) VALUES(?,?)`;
        db.run('INSERT INTO profile(name, email, password, address, dog_breed dog_gender, dog_age, dog_pic) VALUES(?,?,?,?,?,?)', [reqBody.name, reqBody.email, reqBody.password, reqBody.address, reqBody.dog_breed, reqBody.dog_gender, reqBody.dog_age, reqBody.dog_pic], (err) => {
            if (err) {
                return console.log(err.message);
            }
            res.status(200).json('Profile has been created successfully!!!')
        })
    } catch (e) {
        console.log(e);
        res.status(400).json('Something went wrong....')
    }
});

// ${req.body.email}
// login
router.post('/login', (req, res) => {
    try {
        let sql = 'SELECT * FROM profile';
        console.log(sql)
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            let isUserExists = rows.find(o => o.email == req.body.email);
            if (!isUserExists) {
                return res.status(401).json('User not found...')
            } else {
                if (isUserExists.password != req.body.password) {
                    return res.status(401).json('Email or password is incorrect...')
                } else {
                    delete isUserExists.password;
                    res.status(200).send(isUserExists)
                }
            }
        });
    } catch (e) {
        res.status(400).json('Something went wrong....')
    }
})


// Get all 
router.get('/all', (req, res) => {
    try {
        let sql = `SELECT * FROM profile`;
        let data = [];
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            // console.log(rows)
            _.remove(rows, (row) => {
                if (row.dog_gender) {
                    return row.dog_gender.toLowerCase() == req.query.gender.toLowerCase();
                }
            })
            rows.forEach((row) => {
                let obj = {};
                console.log(row)
                obj.id = row.id;
                obj.name = row.name;
                obj.email = row.email;
                obj.dog_gender = row.dog_gender;
                obj.address = row.address;
                obj.dog_breed = row.dog_breed;
                obj.dog_age = row.dog_age;
                obj.dog_pic = row.dog_pic;
                data.push(obj);
            });
            if (data.length == 0) res.status(400).json('No dogs found.....')
            else {
                res.status(200).json(data);
            }
        });
    } catch (e) {
        res.status(400).json('Something went wrong....')
    }
})


router.post('/arrangeMeet', (req, res) => {
    try {
        let reqBody = req.body;
        db.run('CREATE TABLE IF NOT EXISTS interest(id INTEGER PRIMARY KEY AUTOINCREMENT, firstPartyId TEXT, secondPartyId TEXT, remarks TEXT)');

        let sql = `INSERT INTO interest(name) VALUES(?,?)`;
        db.run('INSERT INTO interest(firstPartyId, secondPartyId, remarks) VALUES(?,?,?,?,?,?)', [reqBody.firstPartyId, reqBody.secondPartyId, reqBody.remarks], (err) => {
            if (err) {
                return console.log(err.message);
            }
            res.status(200).json('Thamnks for showing interest...')
        })
    } catch (e) {
        console.log(e);
        res.status(400).json('Something went wrong....')
    }
})


// Get all 
router.get('/getAllMeets', (req, res) => {
    try {
        let sql = `SELECT * FROM interest`;
        let data = [];
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(rows)
            _.remove(rows, (row) => {
                return row.firstPartyId == req.query.firstPartyId;
            })
            rows.forEach((row) => {
                let obj = {};
                console.log(row)
                obj.id = row.id;
                obj.firstPartyId = row.firstPartyId;
                // obj.firstPartyId = row.firstPartyGender;
                // obj.firstPartyId = row.firstPartyBreed;
                // obj.firstPartyId = row.firstPartyAge;
                obj.secondPartyId = row.secondPartyId;
                obj.remarks = row.remarks;
                data.push(obj);
            });
            if (data.length == 0) res.status(400).json('No meets found.....')
            else {
                res.status(200).json(data);
            }
        });
    } catch (e) {
        res.status(400).json('Something went wrong....')
    }
})


router.post('/uploadPic', (req, res) => {
    try {
        fileUpload.localUpload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ success: false, msg: err.message, errors: err });
            }
            if (!req.file) {
                return res.status(400).json({ success: false, msg: "No file passed", errors: err });
            }
            // let rootPath = path.join(__dirname, '../uploads/');
            res.status(200).sendFile(req.file.path)
        })
    }
    catch (e) {
        console.log(e)
        res.status(400).json('Some error occured...')
    }
})


router.put('/:name', (req, res) => {
    let sql = '';
    if (req.body.name) {
        sql = `UPDATE profile
        SET cityName = ?
        WHERE cityName = ?`;
    }
    else {
        sql = `UPDATE cities
        SET cityPopulation = ?
        WHERE cityName = ?`;
    }
    db.run(sql, [req.body.cityName, req.params.name], function (err) {

        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else { res.status(200).json('Successfully updated') };
    });
})


router.delete('/removeProfile', (req, res) => {
    let sql = `DELETE FROM profile WHERE id=?`;
    db.run(sql, [req.body.id], function (err) {
        if (err) {
            console.log(err.message);
            res.status(400).json(err);
        }
        res.status(200).json('Successfully deleted');
    });
})


module.exports = router;
