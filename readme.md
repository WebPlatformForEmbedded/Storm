
```
 _    _______ _____ _____         _  ______                                           _    
| |  | | ___ \  ___|_   _|       | | |  ___|                                         | |   
| |  | | |_/ / |__   | | ___  ___| |_| |_ _ __ __ _ _ __ ___   _____      _____  _ __| | __
| |/\| |  __/|  __|  | |/ _ \/ __| __|  _| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ /
\  /\  / |   | |___  | |  __/\__ \ |_| | | | | (_| | | | | | |  __/\ V  V / (_) | |  |   < 
 \/  \/\_|   \____/  \_/\___||___/\__\_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\
                                                                                           
```

WPETestFramework is an automated tester for Framework enabled devices.

# Setup

To get started run:
```
npm install
```

# Run

To run WPETestFramework:
```
node WPETestFramework.js -u <email>
```

Where <email> is the same as the email used to login to the Metrological dashboard. Once the agent is succesfully connected please nagivate to the Metrological dashboard and you can control/interact with the agent from there.

# Local

WPETestFramework supports running the agent locally, for testing purposes or when no active internet connection is available.
Note: This will not save any information/history/etc into the Metrological dashboard.

To run WPETestFramework with the commandline stub:
```
node WPETestFramework.js -l
```

And an interactive commandline interface will appear. Run `help` for the CLI help menu.