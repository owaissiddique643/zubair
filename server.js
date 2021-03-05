var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const fs = require('fs')
const multer = require('multer')
const admin = require("firebase-admin");

var { userModle, shopCartModel, sweetOrdersModel } = require("./dbrepo/modles");
var authRoutes = require("./routes/auth")
console.log(userModle, shopCartModel, sweetOrdersModel)

var { SERVER_SECRET } = require("./core/index");

const PORT = process.env.PORT || 5000;


var app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/", express.static(path.resolve(path.join(__dirname, "public"))));
app.use('/', authRoutes)

app.use(function (req, res, next) {
    console.log('cookie', req.cookies)

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    console.log("Asign value of token" , req.cookies.jToken)

    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        console.log("decodedData .................>>>>>>>>>>" , decodedData)
        if (!err) {
            const issueDate = decodedData.iat * 1000
            const nowDate = new Date().getTime()
            const diff = nowDate - issueDate

            if (diff > 30000) {
                res.status(401).send('Token Expired')

            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                })
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next()
            }
        } else {
            res.status(401).send('invalid Token')
        }

    });

})

////// Get profile and user data in user interface
////// Get profile and user data in user interface
////// Get profile and user data in user interface

app.get('/profile', (req, res, next) => {

    console.log(req.body)


    userModle.findById(req.body.jToken.id, "name email phone role gender cratedOn",
        function (err, data) {
            console.log(data)
            if (!err) {
                res.send({
                    profile: data
                })
            } else {
                res.status(404).send({
                    message: "server err"
                })
            }

        })

})

//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api

const storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

//==============================================

var SERVICE_ACCOUNT ={
    "type": "service_account",
    "project_id": "website-cdf14",
    "private_key_id": "99677956aa2421fc78d2637905865c17beed8cb7",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDY5T0KhQIbPMXh\nNxXyl3WaGKuBus49g3Z1bo6oLxJIDHtigb5r1YlqpEp9A9UkvfjPclXR/b/5QVZV\nBTOx7gUouaV2KNoGnyeYtEyCtJXXB6KmuIrQrDYa3sonkhkUTowFk4y8MlCltS3I\nCrC1eUARv3+TuXgdVvRpwpHV18ZFkVsNQqyyjIldWLxavbnNRtF/c8/MEFRI4b4A\nqhGB665FvHov9dUdxkDhloNRMYuT3U2EYRq1UFmGMm2TXstE+Fv1M0OAJTJQFG/1\nj6agNV3XRUiXjFiv57Nocvr6QTAtxYCqABs0L+OTjSMu5rpPTebcoiXkRyWSlG5c\nXoGthfDNAgMBAAECggEAMjC98ti7l4z1J3wlTolg8+NAkNknD5ID0AHg7idSXizR\nQobOh0qXLX/OIubHpGR3lp2ZIWpMScQmU69L+qEfPYDUOqcSaNTch1g1mktqnyNL\nrrPmn4oyTP6AHi8PMaVJfqLZvtUP14C5EuDyalQgENtVDNyu4G82SOD2+VqgrYkb\nva3WrCwi6DS5lISy8m4tJdTsq3zWc0hs84NMAPLvyzxyOz08Ov0ZU42T9AgkmNSQ\nEU9siUDybjMp7W8Faj10CRtR6fef1FJ6It1s4oyPrzoqjlhLaXaM3sPRiIQyMCLm\nElHdCDZaYBoOwM1PXtW70tsaYcmpdDlhrBnvWYZZOwKBgQD0SfwdhubbVS5AfIC/\n8u4u2SPoz+SlwNHIYGvUSD+JxYLMH9NTb/m5rO7GHtOIPNhe9+MvvAZnnxcyx4j0\no2nufGRVM+TkhqXWZfM4fym41suTBz1Roabo8RLjxv6Zfv8q+4PRRB5ZEnLs7BBw\n1zvpkldJdmqSWu7VgMLFu05/kwKBgQDjSxGdx8KyJ0QR2t/QRAyhQ+xiPSj9ictw\nGlXDAcP3FvJPYKv9WXnGZ0XVH3WkucIyYoklXDMv4HII+wAERXWB6b/MFbfliMZc\noj752Ud/odZ/AYlg+1Stx/nmZK6era0R07mM5IY1ZNzSAJA/SaW5Yx/wRh/W5r3l\n8UxA58xKHwKBgFtQ9K9M6CsA8mMkpzQZaTOV87hpTf0v0LtoX6Zgw2+Kp1QKaYJ9\nDwp7PF5O05/PrsoBO6lyTaqaa5+NuwJHu6dsVE0NMvjB5Gf6gCqUTlJL6JkzUZac\nKLpWs0r17eIO+O9mSWYGYpnFLbSmoZasvjaXf410eG3xE+o3UZd8ZuGFAoGBAKH8\n10I+ouh7CY08EzSHuwSXtvlQo00GjoGHk0WWlYYcyXZ+7DR0N1CKO3+nmx1Z8igc\nh6ejrSta54q08A8bPaLn53RYqiYhM1XDn+RK0SUKPydm/fSrSm9LzTNA4B5goq7I\n2T2rhGa7SpE0K5mfMEgOeC2ynHB5JC+jp/e9+597AoGBALMMjPLbN29q2tUqumOA\nNqm5gAOhnT5BDTYkxB28jEWmd3fNMm0F7xHsxs4qH66dAM3M3Fah2P6dFuYNisFH\n6USmVvJalgLZulHgLD8tonl2ciBYWCEcpxZ77M8FWt/dO46qEZjmSyMC013PzzQZ\n66JDaJAjDKnmLARQE2LmvCUB\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-gaxzc@website-cdf14.iam.gserviceaccount.com",
    "client_id": "105991612429637029092",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gaxzc%40website-cdf14.iam.gserviceaccount.com"
  }
  

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    DATABASE_URL: "https://website-cdf14-default-rtdb.firebaseio.com/"
});

const bucket = admin.storage().bucket("gs://website-cdf14.appspot.com");

//==============================================

app.post("/uploadcart", upload.any(), (req, res, next) => {

    bucket.upload(
        req.files[0].path,

        function (err, file, apiResponse) {
            if (!err) {
                console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
              
                    if (!err) {
                        // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        console.log( "headerskdflasfjks ka data  ===================>>>>> " ,req.headers.jToken.id)
                        console.log( "headerskdflasfjks request headers  ===================>>>>> " ,req.headers)
                        userModle.findById(req.headers.jToken.id, 'email role', (err, users) => {
                            console.log("Adminperson ====> ", users.email)

                            if (!err) {
                                shopCartModel.create({
                                    "title": req.body.title,
                                    "price": req.body.price,
                                    "availability": req.body.availability,
                                    "cartimage": urlData[0],
                                    "description": req.body.description
                                })
                                    .then((data) => {
                                        console.log(data)
                                        res.send({
                                            status: 200,
                                            message: "Product add successfully",
                                            data: data
                                        })

                                    }).catch(() => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: "Not added, " + err
                                        })
                                    })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})


////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase


app.get('/getProducts', (req, res, next) => {
    shopCartModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})


/////// Save order in Database
/////// Save order in Database
/////// Save order in Database
/////// Save order in Database
/////// Save order in Database


app.post("/order", (req, res, next) => {
    console.log("fsfsf", req.body)
    if (!req.body.orders || !req.body.total) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "orders": "order",
                "total": "12342",
            }`)
        return;
    }

    userModle.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            sweetOrdersModel.create({
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                email: user.email,
                orders: req.body.orders,
                total: req.body.total
            }).then((data) => {
                res.status(200).send({
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
})


/////// Get all orders in Admin panel 
/////// Get all orders in Admin panel 
/////// Get all orders in Admin panel 
/////// Get all orders in Admin panel 
/////// Get all orders in Admin panel 


app.get('/getorders', (req, res, next) => {
    sweetOrdersModel.find({}, (err, data) => {
        console.log("dlfsdjlaskdfj data datat tatdta + ", data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})

app.listen(PORT, () => {
    console.log("surver is running on : ", PORT)
});







