
```
        888                                
        888                                
        888                                
.d8888b 888888 .d88b. 888d88888888b.d88b.  
88K     888   d88""88b888P"  888 "888 "88b 
"Y8888b.888   888  888888    888  888  888 
     X88Y88b. Y88..88P888    888  888  888 
 88888P' "Y888 "Y88P" 888    888  888  888 
                                                                                           
```

Storm is an automated tester for Thunder enabled devices.

# Setup

To get started run:
```
npm install
```

# Run

To run Storm:
```
node WPETestFramework.js -u <email>
```

Where <email> is the same as the email used to login to the Metrological dashboard. Once the agent is succesfully connected please nagivate to the Metrological dashboard and you can control/interact with the agent from there.

# Local

Storm supports running the agent locally, for testing purposes or when no active internet connection is available.
Note: This will not save any information/history/etc into the Metrological dashboard.

To run Storm with the commandline stub:
```
node WPETestFramework.js -l
```

And an interactive commandline interface will appear. Run `help` for the CLI help menu.
