const { Thought, User } = require('../models');

module.exports = {
    addThought: async (req, res) => {
        const {
            userId,
            username,
            thoughtText,
        } = req.body;
        try {
            const newThought = await Thought.create({
                username,
                thoughtText,
            })
            User.findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    $push: { thoughts: newThought._id }
                },
                {
                    new: true
                }
            );
                    res.json(newThought);            
        } catch (e) {
            res.json(e);
        }
    },
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find()
                .populate(
                    {
                        path: "username",
                    });
            res.json(thoughts);
        } catch (e) {
            res.json(e);
        }
    },
    getThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const thought = await Thought.findById(thoughtId);
            res.json(thought);
        } catch (error) {
            res.json(error);
        }
    },
    updateThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { ...req.body },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.json(updatedThought);
        } catch (e) {
            res.json(e);
        }
    },
    removeThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const deletedThought = await Thought.findByIdAndDelete(thoughtId);
            res.json(deletedThought);
        } catch (e) {
            res.json(e);
        }
    },
    addReaction({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
            _id: params.thoughtId
        }, {
            $push: {
                reactions: body
            }
        }, {
            new: true,
            runValidators: true
        })
            .then(updatedThought => {
                if (!updatedThought) {
                    res.status(404).json({
                        message: 'No reaction found with this id!'
                    });
                    return;
                }
                res.json(updatedThought);
            })
            .catch(err => res.json(err));
    },
    // Delete a reaction
    removeReaction({
        params
    }, res) {
        Thought.findOneAndUpdate({
            _id: params.thoughtId
        },
            //allows to remove the reaction by id
            {
                $pull: {
                    reactions: {
                        reactionId: params.reactionId
                    }
                }
            }, {
            new: true
        }
        )
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({
                        message: 'No reaction found with this id.'
                    });
                    return;
                }
                res.json(thought)
            })
            .catch(err => res.json(err));
    },
};
