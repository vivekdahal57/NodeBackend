/**
 * Created by i82325 on 5/30/2019.
 */
module.exports = {
    "port": 3601,
    "appEndpoint": "http://localhost:3601",
    "apiEndpoint": "http://localhost:3601",
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 600,
    "environment": "dev",
    "permissionLevel":{
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    }
};