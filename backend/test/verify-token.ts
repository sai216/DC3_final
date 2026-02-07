import jwt from 'jsonwebtoken';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZhYjU0YS05MGVhLTQ5NzMtOWMxYS02Njk5OTNmZmYzYjciLCJhdXRoU3RhZ2UiOjIsImlhdCI6MTc3MDMyMzQ3MCwiZXhwIjoxNzcxMTg3NDcwfQ.j_A3nOZWEU9XzyD4N_jbu0rrMV0yFYeIrmIMaigLYOQ";
const secret = "Shradhesh71";

try {
  const decoded = jwt.verify(token, secret);
  console.log("✓ Token is VALID");
  console.log("Decoded payload:", JSON.stringify(decoded, null, 2));
} catch (error: any) {
  console.log("✗ Token is INVALID");
  console.log("Error:", error.message);
}
