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
    tags: [String],
    created: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//defining indices:
storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.index({ location: '2dsphere' });

//auto generating the slug...
storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name); 
    //possible duplicate names, so...
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
    //will make more resilient --more unique slugs
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
         { $unwind: '$tags'},
         { $group: { _id: '$tags', count: { $sum: 1 } }},
         { $sort: { count: -1 }}
    ]);
};

storeSchema.statics.getTopStores = function() {
    return this.aggregate([
        //lookup stores, and populate
        { $lookup: 
            { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } 
        },
        //match where the 2nd position in reviews exists
        { $match: { 'reviews.1': { $exists: true } }},
        //sort by new field, highest reviews first
        { $addFields: {
            averageRating: { $avg: '$reviews.rating' }
        }},
        { $sort: { averageRating: -1 }},
        //limit to 10
        { $limit: 10 }
    ])
};


//this is feature in mongoose only
//looking for reviews where _id === store;
storeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id', //store field
    foreignField: 'store' //review field
});
  

function autopopulate(next) {
    this.populate('reviews');
    next();
};

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);


module.exports = mongoose.model('Store', storeSchema);
