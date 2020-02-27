const router = require("express").Router();
const Shelves = require("../models/user-shelves.js");

router.get("/byUser/:id", (req, res) => {
    const userId = req.params.id;
    Shelves.findByUserId(userId)
        .then(userShelf => {
            if (userShelf == undefined) {
                res.status(400).json({ message: "userShelf: does not exist" });
            } else {
                res.status(200).json(userShelf);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "error in returning data" });
        });
});

router.get("/:id", (req, res) => {
    const shelfId = req.params.id;
    Shelves.findById(shelfId)
        .then(userShelf => {
            if (userShelf == undefined) {
                res.status(400).json({ message: "userShelf: does not exist" });
            } else {
                res.status(200).json(userShelf);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "error in returning data" });
        });
});

router.post("/:userId", (req, res) => {
    const userId = req.params.userId;
    const shelfName = req.body.shelfName;
    const isPrivate = req.body.isPrivate;

    const userShelfObj = {
        userId: userId,
        shelfName: shelfName,
        isPrivate: isPrivate
    };
    Shelves.add(userShelfObj)
        .then(userShelf => {
            if (userShelf == undefined) {
                res.status(400).json({ message: "userShelf: does not exist" });
            } else {
                res.status(200).json(userShelf);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "error in returning data" });
        });
});

router.put("/:userId", (req, res) => {
    const userId = req.params.userId;
    const shelfName = req.body.shelfName;
    const isPrivate = req.body.isPrivate;

    const updatedShelfobj = {
        userId: Number(userId),
        shelfName: shelfName,
        isPrivate: isPrivate
    };

    Shelves.findById(userId).then(shelf => {
        if (shelf.length > 0) {
            const shelfId = shelf[0].id;
            Shelves.update(updatedShelfobj, shelfId)
                .then(updatedShelf => {
                    res.status(200).json(updatedShelf);
                })
                .catch(err => {
                    res.status(500).json({ message: "" });
                });
        } else {
            res.status(404).json({ message: "userShelf: does not exist" });
        }
    });
});

router.delete("/:userId", (req, res) => {
    const userId = req.params.userId;
    Shelves.findById(userId).then(shelf => {
        if (shelf.length > 0) {
            const shelfId = shelf[0].id;
            Shelves.remove(shelfId)
                .then(deletedShelf => {
                    res.status(200).json(deletedShelf);
                })
                .catch(err => {
                    res.status(500).json({ message: "Could not remove shelf" });
                });
        } else {
            res.status(404).json({ message: "userShelf: does not exist" });
        }
    });
});

module.exports = router;
