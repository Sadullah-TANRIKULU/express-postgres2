const client = require("./database");

const createNote = (req, res) => {
    try {
        const { note } = req.body;
        if(!note) {
            throw Error("Send note in request body");
        }
        client.query(
            "INSERT INTO notes (note) VALUES ($1)", [note], 
            (err, data) => {
                res.status(201).json({
                    error: null,
                    message: "Created new note",
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to create new note",
        });
    }
};

const getNotes = (req, res) => {
    try {
        client.query("SELECT * FROM notes", (err, data) => {
            if (err) throw err;

            res.status(200).json({
                err: null,
                notes: data.rows,

            });
        });
    } catch (error) {
        res.status(500).json({
            err: error.message,
            notes: null,
        });
    }
};

const getNoteById = (req, res) => {
    try {
        const id = req.params.id;
        client.query("SELECT * FROM notes WHERE id = $1", [id], (err, data) => {
            if (err) throw err;
            
            res.status(200).json({
                err: null,
                note: data.rows[0],
            });
        });
    } catch (error) {
        res.status(500).json({
            err: err.message,
            note: null,
        });
    }
};

const updateNoteById = (req, res) => {
    try {
        const id = req.params.id;
        const note = req.body.note;

        client.query("UPDATE notes SET note = $1 WHERE id = $2",
        [note, id],
        (err, data) => {
            if (err) throw err;

            res.status(201).json({
                err: null,
                message: "Note updated",
            });
        });
    } catch (error) {
        res.status(500).json({
            err: error.message,
            message: "Failed to update note",
        });
    }
};

const deleteNote = (req, res) => {
    try {
        const id = req.params.id;
        client.query("DELETE FROM notes WHERE id = $1", [id], 
        (err, data) => {
            if (err) throw err;
            res.status(200).json({
                err: null,
                message: "Note deleted",
            });
        });
    } catch (error) {
        res.status(500).json({
            err: error.message,
            message: "Failed to delete note",
        });
    }
};


module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNoteById,
    deleteNote,

}