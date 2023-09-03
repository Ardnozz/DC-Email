# DC-Email
Discord bot that handles IMAP requests and sends the content to the user.

## Before initialization:

1. You need to create and setup a basic discord bot via https://discord.com/developers/
2. Create ".env" file in root directory and insert the following content with your datas.

```js
TOKEN="YOUR_TOKEN"
CLIENT_ID="BOT_CLIENT_ID"
GUILD_ID="MAIN_GUILD_ID"
ERROR_CHANNEL_ID="ERROR_CHANNEL_ID"
```

3. Create a discord server and insert the guild id and any text channel's id you want.
4. Then run following command:
```
npm install
npm start
```

5. If everything works well, you should see something like

```
Logged in as DC Email#1078!
Started refreshing application (/) commands.
Successfully reloaded application (/) commands.
```

6. If you see something else that looks like an error, create an issue request with the error and the way how to reproduce it.

## Contributing

If you want to contribute, all help is welcome. Just create a fork and edit anything you want, but don't break anything. Your forked application should work as same or either better than before.

Most needed contributing is now separation the code into functions (or classes) so the code isn't that nested, the next is documentation and better error handling.

Happy coding (～￣▽￣)～

## Last Words

If you have some questions or you need to talk with me, you can contact me via discord @ardno or via email ardnozofficial@gmail.com.

Happy using!