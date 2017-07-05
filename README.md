Simple client for Farmbot.

Currently you login, which gets you an auth token, then you can use the
farmbot-js client ( https://github.com/FarmBot/farmbot-js ) to talk to the bot.

Also done, get config info via the REST API (
https://gist.github.com/RickCarlino/10db2df375d717e9efdd3c2d9d8932af )

Next, find out if bot is online and trigger a sequence

Or maybe trigger basic moves/pin changes?

Also- use local storage to remember email/token and maybe password (secure?)