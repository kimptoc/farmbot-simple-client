Simple client for Farmbot.

Currently you login, which gets you an auth token, then you can use the
farmbot-js client ( https://github.com/FarmBot/farmbot-js ) to talk to the bot.

Also done, get config info via the REST API (
https://gist.github.com/RickCarlino/10db2df375d717e9efdd3c2d9d8932af )

Next, find out if bot is online and trigger a sequence - sequence ok, offline status TBD

Or maybe trigger basic moves/pin changes?

Also- use local storage to remember email/token and maybe password (secure?) /done

Other features:
- show current x,y,z, pins off/on
- use jquery mobile ui / nice buttons ?
- error handling
- hide login part if logged in
- hide other part if not logged in/login failed
- mark sequences as favourites - show those on login?
- or just show specific sequences... with a 'show all' option
- error handling!