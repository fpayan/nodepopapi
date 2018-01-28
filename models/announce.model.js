'use strict';

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
 * @type {Object}
 */
const announceSchema = new Schema({
    nameArticle: {
        type: String,
        required: [true, 'The name of article is required']
    },
    textArticle: {
        type: String
    }, 
    price: {
        type: Number,
        required: [true, 'The price og article is required'],
    },
    salesAnnounce: {
        type: Boolean
    },
    urlImage: {
        type: String, 
        lowercase: true, 
        trim: true,
        unique: true,
        required: [true, 'The picture of article is required'],
    },
    tags: {
        type: [
            { 
                type: String, 
                enum: ['work', 'lifestyle', 'motor', 'mobile'] 
            }
        ]
    },
    idUserOwn: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    created: {
      type: Date,
      default: new Date()
    },
    update: {
      type: Date,
      default: new Date()
    }
});

announceSchema.statics.list = function(filters, limit, skip, sort, fields) {

/*
var query = Model.find(conditions).sort(sort).skip(skip).limit(limit);

where

    condition will be say { age: { $gt: 20 } }
    sort will be say { name: 1}
    skip will be say 20
    limit will be say 10

then execute the following query to get the records

return query
        .exec()
        .then(function (cursor) { ...... });
*/

    // obtenemos la query sin ejecutarla
    const query = Announce.find(filters);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort)
    query.select(fields);
    // ejecutamos la query y devolvemos una promesa
    return query.exec();
}
/** @module model/announce */
module.exports = mongoose.model('Announce', announceSchema);