# URL Shortener Microservice

This is a Node.js - Express practice project, url shortener microservice, source: https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice


## Available Endpoints

### `GET /`

- **Description**: Display example usage and output.

---

### `POST /api/shorturl`

- **Description**: Assigns the URL POSTed a unique number (short_url) and stored it in MongoDB, if URL already exists in the database, it returns the old "short_url"
- **Request Example**:
  ```json
  {
    "url": "https://www.example.com"
  }
  ```
- **Response Example**:
  ```json
  {
    "original_url": "https://www.example.com",
    "short_url": 1
  }
  ```

---

### `GET /api/shorturl/:short_url`

- **Description**: Redirects client to website associated with the short_url stored in the database, if no website is associated with the short_url, it throws an error.
- **Route Parameter**:
  - `:short_url` – A Number type parameter that is associated with a specific website.

---

## How to Run Locally

```bash
git clone https://github.com/ammar-elmesaly/URL-Shortener-Express.git
cd URL-Shortener-Express
npm install
npm start
```%                      