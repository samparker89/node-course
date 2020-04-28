const chalk = require('chalk');
const fs = require('fs');
const path = require("path");

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find(note => note.title === title);

    debugger;

    if (!duplicateNote) {
        notes.push({
            body: body,
            title: title
        });
        saveNotes(notes);
        console.log(chalk.green.inverse('New note added'));
    } else {
        console.log(chalk.red.inverse('Note title taken. Please choose something else'));
    }

};

const listNotes = () => {
    console.log(chalk.inverse("Your notes"));

    loadNotes().forEach(note => {
        console.log(note.title)
    });
};

const readNote = (title) => {
    const notes = loadNotes();
    const note = notes.find(note => note.title === title);

    if (note){
        console.log(chalk.inverse(note.title));
        console.log(note.body);
    } else {
        console.log(chalk.red.inverse('Note not found'));
    }
};

const removeNotes = (title) => {
    const notes = loadNotes();
    const sanitisedNotes = notes.filter(note => note.title !== title);

    if (notes.length > sanitisedNotes.length)
    {
        saveNotes(sanitisedNotes);
        console.log(chalk.green.inverse('Removed Note'));
    } else {
        console.log(chalk.red.inverse('Note does not exist. Could not remove'));
    }

};

const loadNotes = () => {
    try {
        const notesPath = path.resolve(__dirname, "notes.json");
        const dataBuffer = fs.readFileSync(notesPath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

const saveNotes = (notes) => {
    const notesJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', notesJSON);
};

module.exports = {
    addNote: addNote,
    listNotes: listNotes,
    readNote: readNote,
    removeNotes: removeNotes
};