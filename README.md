# orchestra-pdf
A small PDF generation service for internal use, built upon [puppeteer](https://github.com/puppeteer/puppeteer).

## Usage
The server only listens for incoming requests on the root `/`.
URL | Desc
--- | ---
`GET /` | Use to render a given URL. Provide a URL to be rendered as the `url` query parameter
`POST /` | Use to render give HTML body. Request body has to be a JSON object `{ contents, title }`.

## Start server
```
npm start
```

## Package for AWS Elastic Beanstalk deployment
```
npm run pack
```