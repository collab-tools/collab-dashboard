# Collab Dashboard

Dashboard displaying metrics for Collab.

### Prerequisites

* Please set up [Collab](https://github.com/collab-tools/collab) before setting up the dashboard.
This will take care of the databases and various shared dependencies.
* Use Node v8 to setup

### Development Setup

1. Clone repository to Collab-tools root folder.
   
   ```bash
   $ git clone https://github.com/collab-tools/collab-dashboard.git
   ```

2. Create `config/local-dev.json` using the `config/_local-template.json` template. If unsure, please contact a fellow engineer!

    ```bash
    cp config/_local-template.json config/local-dev.json
    ```
    
3. Enter config details in local-dev.json (DB details same as that provided for collab config)

4. Link collab-db-applications and collab-db-logging.

    ```bash
    $ sudo npm link collab-db-application collab-db-logging```

5. Install dependencies

    ```bash
    # Install server dependencies
    $ sudo npm install
    # Install client dependencies
    $ cd public/
    $ sudo npm install
    $ sudo npm install -g grunt-cli bower
    $ bower install
    ```

3. Build the server

    ```bash
    $ cd ../
    $ sudo npm install babel-preset-env
    $ sudo npm run compile
    ```

4. Run the server. Server should start on port 4000.

    ```bash
    npm run dev
    ```

5. Create an admin user (username: admin ; password : veryverysecretpassword) by running the following in a new terminal.

    ```bash
    # (Assuming your developer_key is set to 12341234 in config/local-dev.json)
    $ curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'devKey=12341234&username=admin&password=veryverysecretpassword&name=admin&role=admin' "http://localhost:4000/api/admin"
    ```

6. Serve the client files

    - Use nginx for reverse proxying `/api/*` requests to the server. To install nginx :
        ```bash 
        $ sudo apt-get install nginx
        ```
    -  You might have to stop apache before starting this service, if both services run on the same port.
        ```bash
        $ sudo service apache2 stop```
    -  Add the following to root\etc\nginx\nginx.conf (within http{}) and root\etc\nginx\sites-available\default

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
     - Start nginx service : 
        ```bash
        $ sudo service nginx restart```

7. If run in local server:
* start server at `/collab-dashboard` by running `npm run dev`
* start client at `/collab-dashboard/public` by running `grunt build`and`grunt watch`
        
8. Open http://localhost:4000 on your browser and login with admin credentials.

### Additional Notes

- `grunt build` to build client assets.
- `grunt watch` to watch for changes and build client assets.
