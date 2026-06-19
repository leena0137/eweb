// Enable CORS
const allowedOrigins = [
  'https://indiacart24.com',
  'https://www.indiacart24.com',
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-side requests)
    if (!origin) return callback(null, true);

    const allowed =
      allowedOrigins.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.trycloudflare.com') ||
      origin.endsWith('.loca.lt');

    if (allowed) {
      return callback(null, true);
    }

    console.log('❌ Blocked Origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Bypass-Tunnel-Reminder',
  ],
};

app.use(cors(corsOptions));