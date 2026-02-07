import jwt from "jsonwebtoken";

function requestJwt(userId: string){
            const secret = "Shradhesh71";
            
            const payload = {
                userId: userId,
                authStage: 2  // Fully authenticated
            }

            const token = jwt.sign(payload, secret, {
                expiresIn: "10d",
            })

            console.log(token);
        }

requestJwt("536ab54a-90ea-4973-9c1a-669993fff3b7")