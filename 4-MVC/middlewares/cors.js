import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://192.168.0.13:8080',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => 
    (acceptedOrigins.includes(origin) || !origin) 
      ? callback(null, true) 
      : callback(new Error('Not Allowed by CORS'))
})