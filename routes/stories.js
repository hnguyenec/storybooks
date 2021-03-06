const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", (req, res) => {
    Story.find({ status: "public" })
        .populate("user")
        .then(stories => {
            res.render("stories/index", {
                stories: stories
            });
        });
});

// Process Add Story
router.post("/", (req, res) => {
    let allowComments;

    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = new Story({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    });

    newStory.save().then(story => {
        res.redirect(`/stories/show/${story._id}`);
    });
});

// Show single story
router.get("/show/:id", (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate("user")
        .then(story => {
            res.render("stories/show", {
                story: story
            });
        });
});

// Add story form
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("stories/add");
});

// Edit story form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        res.render("stories/edit", {
            story: story
        });
    });
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        let allowComments;

        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }

        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = allowComments;

        story.save()
            .then(story => {
                res.redirect('/dashboard');
            });
    });
});

router.delete('/:id', (req, res) => {
    Story.remove({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard');
        })
});

module.exports = router;