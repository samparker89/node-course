const fs = require('fs');
const yargs = require('yargs');

const notes = require('./notes.js');

const bodyArg = {
    describe: "Body text of the note",
    demandOption: true,
    type: 'string'
};

const titleArg = {
    describe: "Note title",
    demandOption: true,
    type: 'string'
};

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder:{
        body: bodyArg,
        title: titleArg
    },
    handler(argv) { notes.addNote(argv.title, argv.body); }
});

// Create add command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder:{
        title: titleArg
    },
    handler(argv) { notes.removeNotes(argv.title); }
});

// Create add command
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: titleArg
    },
    handler(argv) { notes.readNote(argv.title) }
});

// Create add command
yargs.command({
    command: 'list',
    describe: 'Listing out all the notes',
    handler() { notes.listNotes(); }
});

yargs.parse();