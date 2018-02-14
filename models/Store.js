const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String]
});

//auto generating the slug...
storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name); 
    next();
    //will make more resilient --more unique slugs
})

module.exports = mongoose.model('Store', storeSchema);
