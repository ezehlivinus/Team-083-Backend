
const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = mongoose.Schema({
                                        _id: { 
                                            
                                            type: String, 
                                            
                                            required: true,
                                            
                                            unique: true
                                        },
                                        name: { 
                                            
                                            type: String, 
                                            
                                            required: true 
                                        },
                                        status: {
                                            
                                            type: String,
                                            
                                            enum : ['PENDING','ACTIVE','SUSPENDED','DELETED'],
                                            
                                            default: 'ACTIVE'
                                        },
                                        password: {
                                            
                                            type: String,
                                            
                                            required:true
                                        },
                                        userType: {
                                            
                                            type: String,
                                            
                                            enum : ['ADMIN','SME','FUNDER'],
                                            
                                            required: true,
                                            
                                            uppercase:true
                                        },
                                        email: {
                                            
                                            type: String,
                                            
                                            required: true,
                                            
                                            unique: true,
                                            
                                            lowercase: true,
                                            
                                            validate: (value) => {
                                            
                                                return validator.isEmail(value)
                                            }
                                        }
                                        },
                                        {
                                            timestamps: true
                                        });

module.exports = mongoose.model('users', userSchema);
