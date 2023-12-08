const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(express.json());

// Search by types with post method
app.post('/search', (req, res) => {
    const searchType = req.body.searchType;
    const searchValue = req.body.searchValue;

    fs.readFile('student.json', (err, data) => {
        if (err) throw err;
        let studentDetails = JSON.parse(data);

        let status = { found: false };

        for (let student of studentDetails) {
            if (String(student[searchType]) === String(searchValue)) {
                status = { found: true, student: student };
                break;
            }
        }

        res.json(status);
    });
});

//view all students with get method
app.get('/student', (req, res) => {
    fs.readFile('student.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while reading the file.');
        } else {
            const students = JSON.parse(data);
            res.status(200).send(students);
        }
    });
});



// add new students with post method
app.post('/student', (req, res) => {
    const newStudent = req.body;

    fs.readFile('student.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while reading the file.');
        } else {
            const students = JSON.parse(data);
            students.push(newStudent);

            fs.writeFile('student.json', JSON.stringify(students, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred while writing to the file.');
                } else {
                    res.status(200).send('Data saved successfully');
                }
            });
        }
    });
});

// Update a student with put method
app.put('/student/:sid', (req, res) => {
    const sid = req.params.sid;
    const updatedStudent = req.body;

    fs.readFile('student.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while reading the file.');
        } else {
            let students = JSON.parse(data);
            const index = students.findIndex(student => student.sid == sid);

            if (index !== -1) {
                students[index] = updatedStudent;

                fs.writeFile('student.json', JSON.stringify(students, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('An error occurred while writing to the file.');
                    } else {
                        res.status(200).send('Data updated successfully');
                    }
                });
            } else {
                res.status(404).send('Student not found');
            }
        }
    });
});

// Delete a student using delete method
app.delete('/student/:sid', (req, res) => {
    const sid = req.params.sid;

    fs.readFile('student.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while reading the file.');
        } else {
            let students = JSON.parse(data);
            const index = students.findIndex(student => student.sid == sid);

            if (index !== -1) {
                students.splice(index, 1);

                fs.writeFile('student.json', JSON.stringify(students, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('An error occurred while writing to the file.');
                    } else {
                        res.status(200).send('Data deleted successfully');
                    }
                });
            } else {
                res.status(404).send('Student not found');
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});