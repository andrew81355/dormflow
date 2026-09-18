```bash
npm install
cp .env.example .env  
npm run seed           
npm start              
```

enter: `admin@dormflow.test` / `password123` (student: `andrei@dormflow.test`).

## Docker

```bash
docker build -t dormflow .
docker run -p 3000:3000 --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/dormflow dormflow