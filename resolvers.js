const { AuthenticationError } = require('apollo-server')

const user = {
    _id: "1",
    name: "Mike",
    email: "mike.nguyen@gmail.com",
    picture: "https://cloudinary.com/asdadasd"
}

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }
    

    return next(root, args, ctx, info)
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser),
        // getPins: (root, args, ctx) => {
        //     const pins = await pins.find({});
        //     return pins;
        // }
    }
}