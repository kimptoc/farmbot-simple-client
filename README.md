Simple client for Farmbot.

Try it here - https://kimptoc.github.io/farmbot-simple-client/public/

Currently you login, which gets you an auth token, then you can use the
farmbot-js client ( https://github.com/FarmBot/farmbot-js ) to talk to the bot.

Also done, get sequence config info via the REST API (
https://gist.github.com/RickCarlino/10db2df375d717e9efdd3c2d9d8932af )


TODO:
- buttons triggering 1pass to save password. Name login fields differently
- or just show specific sequences... with a 'show all' option
- e-stop button
- basic manual move buttons
- device status - online/offline?
- show current x,y,z, pins off/on

Ideas...
https://www.smashingmagazine.com/2017/07/designing-perfect-slider/

DONE:
- error handling! login failed , exec seq, pin change etc
- trigger a sequence
- trigger basic pin changes?
- use local storage to remember email/token and maybe password (secure?)
- use jquery mobile ui / nice buttons ?
- hide login part if logged in
- hide other part if not logged in/login failed
