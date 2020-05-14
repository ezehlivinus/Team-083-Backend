const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuidv1');


/** New SME or Funder Signup **/

const signup = (req, res) => {

  /* Admin Account can't be created via signup, only SME and Funder account */

  if (req.body.userType && req.body.userType.toUpperCase() == 'ADMIN'){

    return res.status(400).json({
                                  status: 'error',

                                  message: 'Invalid user type'
                                });

  }

  const passwordHash = (req.body.password && req.body.password.length >= 8) ? bcrypt.hashSync(req.body.password, 10) : '';

  const user = new User({
                          _id: uuid(),

                          name: req.body.name,
                          
                          email: req.body.email,
                          
                          password: passwordHash,
                          
                          userType: req.body.userType
                        });

  user.save().then(({_id, name, email, status, userType}) => {

                            const data = { _id, name, email, status, userType};

                            /* Generate User Token */
      
                            const token = jwt.sign(data, process.env.jwtKey, { algorithm: 'HS256', expiresIn: '24h'});

                            /* Create row in the user profile collection for the account */

                            new UserProfile({userId: _id}).save();

                            return res.status(200).json({
                                                          status: 'success',
                                      
                                                          message: 'Account created Successfully',

                                                          data: {token, ...data}
                                                        });
                          }
              ).catch(error => {
                  
                  return res.status(400).json({
                                                status: 'error',

                                                message: error.code === 11000 ? 'Email Already in use' : error.message
                                            });
              });
}



/** ADMIN, SME or Funder Login **/

const login = (req, res) => {

  let { email, password } = req.body;

  if (typeof(email) == "undefined" || typeof(password) == "undefined"){

    return res.status(403).json({
                                  status: "error",
                                
                                  message : "Enter your email and password"

                                });

  }

  User.find({email: email, status: 'ACTIVE'})

            .then( user => {
              
              if (user.length == 0){

                return res.status(403).json({
                                              status: "error",
                                            
                                              message : "Account does not exist"
          
                                            });
          
          
              }
              else if (!bcrypt.compareSync(password, user[0].password)){
          
                return res.status(403).json({
                                              status: "error",
                                            
                                              message : "Incorrect email or password"
          
                                            });
              }
              else{

                /* Extract desired user data */

                let {_id, name, email, status, userType} = user[0];
          
                const data = {_id, name, email, status, userType};
          
                const token = jwt.sign(data, process.env.jwtKey, { algorithm: 'HS256', expiresIn: '24h'});
          
                return res.status(200).json({
                                              status: 'success',

                                              message: 'login Successfully',
                                              
                                              data : {token, ...data}
                                            });

              }
            })

            .catch(error => {
                  
                return res.status(400).json({
                                              status: 'error',

                                              message:  error.message
                                          });
            })

}



/** ADMIN, SME or Funder Account Details **/

const account = (req, res) => {

  /* Join query on users and userprofiles collections */

  User.aggregate([
                  {
                    $match:{
                              "_id": req.userData._id
                            }
                  },
                  {
                    $lookup: {
                                from: "userprofiles", // collection name in db
                                
                                localField: "_id",
                                
                                foreignField: "userId",
                                
                                as: "detail"
                            }
                  }
                ]).exec(function(error, user) {

                  if (error || user.length == 0){

                    return res.status(500).json({ 
                                                  status: "error",
                                                  
                                                  data : error ? error.message : 'Something went wrong'

                                                });
                  }
                  else{

                    /* Extract desired User Data */

                    const {_id, name, email, userType, status, avatar, bio, phone, address, updatedAt, createdAt } = {...user[0], ...user[0].detail[0]};

                    const data = {_id, name, email, userType, status, avatar, bio, phone, address, updatedAt, createdAt };


                    return res.status(200).json({
                                                  status: 'success',

                                                  message: 'Account Details Fetched Successfully',

                                                  data: data
                                                  
                                                });


                  }
                });

}

module.exports = {
                    signup,
                    
                    login,

                    account
                };
