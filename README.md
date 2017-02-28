# Collab Dashboard

Dashboard displaying metrics for Collab.

### Prerequisites

Please set up [Collab](https://github.com/collab-tools/collab) before setting up the dashboard.
This will take care of the databases and various shared dependencies.

### Development Setup

1. Create `config/local-dev.json` using the `config/_local_template.json` template. If unsure, please contact a fellow engineer!

    ```bash
    cp config/_local_template.json config/local-dev.json
    ```

2. Install dependencies

    ```bash
    # Install server dependencies
    npm install
    # Install client dependencies
    cd public/
    npm install
    npm install -g grunt-cli bower
    bower install
    ```

3. Build the server

    ```bash
    npm run compile
    ```

4. Run the server

    ```bash
    npm run dev
    ```

5. Create an admin user

    ```bash
    # (Assuming your developer_key is set to 12341234 in config/local-dev.json)
    curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'devKey=12341234&username=admin&password=veryverysecretpassword&name=admin&role=admin' "http://localhost:4000/api/admin"
    ```

6. Serve the client files

    - Since I'm not an Angular guy and the previous maintainer left out documentation, I'm not too sure what's the best way to go about serving the client files while reverse proxying `/api/*` requests to the server.
    - Feel free to update this documentation!
    - Here's a a nginx config to do so while rewriting the paths as necessary:

        ```nginx
        server {
            listen 9000;

            # Replace this with the path to your collab-dashboard/public/dist/ directory
            root /vagrant/collab-dashboard/public/dist/;
            index index.html index.htm;

            # Make site accessible from http://localhost/
            server_name localhost;

            location /api/ {
                proxy_pass http://127.0.0.1:4000;
            }

            location ~* ^/app {
                try_files /$uri /app/index.html;
            }

            location / {
                try_files $uri $uri/ /app/$uri /app/index.html;
            }
        }
        ```

### Additional Notes

- `grunt build` to build client assets.
- `grunt watch` to watch for changes and build client assets.
