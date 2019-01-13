## Plugin Badges

Download badges for plugins hosted on Spigot, DevBukkit, Ore, and GitHub.

WIP and subject to change. Powered by https://shields.io/

Format: `<baseUrl>/api/<name>-<color>.svg`

Supports:
  * DevBukkit (`?bukkit=<id>` [`https://dev.bukkit.org/projects/<id>`])
  * Spigot (`?spigot=<id>` [`https://www.spigotmc.org/resources/<id>`])
  * Ore (Sponge) (`?sponge=<id>` [id = [Plugin Id](https://docs.spongepowered.org/stable/en/ore/routes/project.html)])
  * GitHub (ex. `https://github.com/<user>/<repo>`)
    * `?ghuser=<user>`
    * `?ghrepo=<repo>`

You can connect multiple parameters with `&`. Supports all https://shields.io/ parameters.

Ex.

`api/SkyChanger-red.svg?spigot=skychanger.37524&bukkit=skychanger&sponge=skychanger&ghuser=dscalzi&ghrepo=SkyChanger&style=for-the-badge`