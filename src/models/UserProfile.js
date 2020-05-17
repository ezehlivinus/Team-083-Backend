
const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
                                            userId: { 
                                                
                                                type: String, 
                                                
                                                required: true, 
                                                
                                                unique: true,
                                            },
                                            avatar: {
                                                
                                                type: String,
                                                
                                                default: ''
                                            },
                                            bio: {
                                                
                                                type: String,
                                                
                                                default: ''
                                            },
                                            phone: {
                                                
                                                type: String,
                                                
                                                default: ''
                                            },
                                            address: {
                                                
                                                type: String,
                                                
                                                default: ''
                                            }
                                        },
                                        {
                                            timestamps: true
                                    });

module.exports = mongoose.model('userprofiles', userProfileSchema);